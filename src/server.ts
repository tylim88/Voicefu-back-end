import express from 'express'
import { initServer } from '@ts-rest/express'
import cors from 'cors'
import env from '../env.json'

export const app = express()
const corsOptions = {
    origin: function (origin: string, callback: (...args: unknown[]) => void) {
        if (env.cors.indexOf('*') !== -1 || env.cors.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
}
// @ts-expect-error 123
app.use(cors(corsOptions))

export const s = initServer()
