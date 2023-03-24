import { contracts } from '../contracts'
import { s } from '../server'
import { auth } from '../firebase'
import { createChatCompletion, createTranscription } from '~/openai_api'
import { DecodedIdToken } from 'firebase-admin/auth'
import { users } from '~/firestore'
import { updateDoc, getDoc, increment } from 'firelord'
import formidable from 'formidable'

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
        console.log({ data })
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

            // const transcriptionResponse = await createTranscription({
            //     file: data.audioFile,
            // })
            // const translatedTextResponse = await createChatCompletion({
            //     userContent: transcriptionResponse.data.text,
            //     user: uid,
            // })
            // const chatData = translatedTextResponse.data
            // const tokenUsage = chatData.usage?.completion_tokens
            // if (!tokenUsage) {
            //     return {
            //         status: 500,
            //         body: {
            //             message: 'token usage is unavailable',
            //         },
            //     }
            // }
            // if (docData.freeToken - tokenUsage < 0) {
            //     return {
            //         status: 402,
            //         body: {
            //             message: 'insufficient token credit',
            //         },
            //     }
            // }

            // await updateDoc(docRef, { freeToken: increment(-tokenUsage) })

            // const translatedText = chatData.choices[0]?.message?.content

            // if (!translatedText) {
            //     return {
            //         status: 500,
            //         body: {
            //             message: 'unknown error',
            //         },
            //     }
            // }

            return {
                status: 200,
                body: {
                    translatedText: '123',
                },
            }
        } catch (e) {
            return {
                status: 500,
                body: {
                    message: 'unknown error',
                },
            }
        }
    },
})
