import { contracts } from './contracts'
import { app } from './server'
import { createExpressEndpoints } from '@ts-rest/express'
import { createTranscriptionRouter } from './router'
import https from 'https'
import env from '../env.json'
import fs from 'fs'
import http from 'http'

createExpressEndpoints(contracts, createTranscriptionRouter, app)

const port = env.port

// https://adamtheautomator.com/https-nodejs/

if (env.production) {
    https
        .createServer(
            {
                key: fs.readFileSync('../key.pem'),
                cert: fs.readFileSync('../cert.pem'),
            },
            app
        )
        .listen(port, () => {
            console.info(`(https)Listening at port ${port}`)
        })
} else {
    http.createServer(app).listen(port, () => {
        console.info(`(http)Listening at port ${port}`)
    })
}

// app.listen(port, () => {
//     console.log(`Listening at http://localhost:${port}`)
// })
