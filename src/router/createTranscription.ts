import { contracts } from '../contracts'
import { s } from '../server'
import { auth } from '../firebase'
import { createChatCompletion, createTranscription } from '~/openai_api'
import { DecodedIdToken } from 'firebase-admin/auth'
import { users } from '~/firestore'
import { updateDoc, getDoc, increment } from 'firelord'
import formidable from 'formidable'
import fs from 'fs'
import axios from 'axios'

export const createTranscriptionRouter = s.router(contracts, {
    createTranscription: async ({ req }) => {
        const form = new formidable.IncomingForm({ multiples: true })
        const data = await new Promise<{
            userIdToken: string
            audioFile: File
        }>((resolve) => {
            form.parse(req, async (err, fields, files) => {
                resolve({
                    audioFile: files['audioFile'] as unknown as File,
                    userIdToken: fields['userIdToken'] as unknown as string,
                })
            })
        })
        let decodedToken: DecodedIdToken = undefined!
        try {
            decodedToken = await auth.verifyIdToken(data.userIdToken, true)
        } catch (e) {
            return {
                status: 401,
                body: {
                    message: 'unauthorized',
                },
            }
        }
        // @ts-expect-error ts-rest improper typing
        const fileName: string = data.audioFile.filepath
        const newFileName = fileName + '.webm'
        try {
            const uid = decodedToken.uid
            const docRef = users.doc(uid)
            const docData = (await getDoc(docRef)).data()
            if (!docData) {
                return {
                    status: 404,
                    body: {
                        message: 'user data is missing',
                    },
                }
            }
            fs.rename(fileName, newFileName, (e) => {
                e && console.log(e)
            })
            const stream = fs.createReadStream(newFileName)

            const transcriptionResponse = await createTranscription({
                readStream: stream,
            })
            const userContent = transcriptionResponse.data.text

            const translatedTextResponse = await createChatCompletion({
                userContent,
                user: uid,
            })
            const chatData = translatedTextResponse.data
            const tokenUsage = chatData.usage?.completion_tokens

            if (!tokenUsage || docData.freeToken - tokenUsage < 0) {
                return {
                    status: 500,
                    body: {
                        tokenUsage: 0,
                        message: 'token usage is unavailable',
                    },
                }
            }
            if (docData.freeToken - tokenUsage < 0) {
                return {
                    status: 402,
                    body: {
                        message: 'insufficient token credit',
                    },
                }
            }

            await updateDoc(docRef, { freeToken: increment(-tokenUsage) })

            const translatedText = chatData.choices[0]?.message?.content

            if (!translatedText) {
                return {
                    status: 500,
                    body: {
                        message: 'unknown error',
                    },
                }
            }
            const query = await axios
                .post(
                    `http://127.0.0.1:50021/audio_query?speaker=1&text=${translatedText}`
                )
                .then((res) => res.data)

            const wavBuffer = await axios
                .post(`http://127.0.0.1:50021/synthesis?speaker=1`, query, {
                    responseType: 'arraybuffer',
                })
                .then((res) => res.data as ArrayBuffer)

            const base64Wav = Buffer.from(wavBuffer).toString('base64')

            return {
                status: 200,
                body: {
                    tokenUsage,
                    translatedText,
                    transcription: userContent,
                    base64Wav,
                },
            }
        } catch (e) {
            console.log({ e })
            return {
                status: 500,
                body: {
                    message: 'unknown error',
                },
            }
        } finally {
            fs.unlinkSync(newFileName)
        }
    },
})
