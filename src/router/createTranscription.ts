import { contracts } from '../contracts'
import { s } from '../server'
import { auth } from '../firebase'
import { createChatCompletion, createTranscription } from '~/openai_api'
import { DecodedIdToken } from 'firebase-admin/auth'
import { users } from '~/firestore'
import { updateDoc, getDoc, increment } from 'firelord'
import formidable from 'formidable'
import fs from 'fs'
import { open } from 'node:fs/promises'

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
            // @ts-expect-error ts-rest improper typing
            const fileName: string = data.audioFile.filepath
            const newFileName = fileName + '.webm'
            fs.rename(fileName, newFileName, (e) => {
                e && console.log(e)
            })
            const stream = fs.createReadStream(newFileName)

            const transcriptionResponse = await createTranscription({
                file: stream,
                prompt: 'translate to japaneses language',
            })
            const userContent = transcriptionResponse.data.text

            const translatedTextResponse = await createChatCompletion({
                userContent,
                user: uid,
            })
            const chatData = translatedTextResponse.data
            const tokenUsage = chatData.usage?.completion_tokens
            if (!tokenUsage) {
                return {
                    status: 500,
                    body: {
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
            return {
                status: 200,
                body: { tokenUsage, translatedText },
            }
        } catch (e) {
            console.log({ e })
            return {
                status: 500,
                body: {
                    message: 'unknown error',
                },
            }
        }
    },
})
