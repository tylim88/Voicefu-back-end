import { contracts } from './contracts'
import { app } from './server'
import { createExpressEndpoints } from '@ts-rest/express'
import { createTranscriptionRouter } from './router'
import env from '../env.json'
import http from 'http'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const greenlock = require('greenlock-express')

createExpressEndpoints(contracts, createTranscriptionRouter, app)
if (env.production) {
    greenlock
        .init({
            packageRoot: process.cwd(),
            configDir: './greenlock',

            // contact for security and critical bug notices
            maintainerEmail: env.email,

            // whether or not to run at cloudscale
            cluster: false,
        })
        // Serves on 80 and 443
        // Get's SSL certificates magically!
        .serve(app)
} else {
    http.createServer(app).listen(3001, () => {
        console.info(`(http)Listening at port 3001`)
    })
}
