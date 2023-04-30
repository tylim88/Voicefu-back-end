import { contracts } from './contracts'
import { app } from './server'
import { createExpressEndpoints } from '@ts-rest/express'
import { createTranscriptionRouter } from './router'
import https from 'https'
import env from '../env.json'
import fs from 'fs'

createExpressEndpoints(contracts, createTranscriptionRouter, app)

const options: { key?: Buffer; cert?: Buffer } = {}

// https://adamtheautomator.com/https-nodejs/
try {
    options.key = fs.readFileSync('../key.pem')
    options.cert = fs.readFileSync('../cert.pem')
} catch (e) {
    if (env.production) {
        throw Error('ssl cert or key not found')
    }
}
const port = env.port
https.createServer(options, app).listen(port, () => {
    console.info(`Listening at port ${port}`)
})
