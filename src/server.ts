import express from 'express'
import { initServer } from '@ts-rest/express'
import cors from 'cors'
import env from '../env.json'

export const app = express()

app.use(cors({ origin: env.cors }))

export const s = initServer()
