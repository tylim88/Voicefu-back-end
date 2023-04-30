import { contracts } from './contracts'
import { app } from './server'
import { createExpressEndpoints } from '@ts-rest/express'
import { createTranscriptionRouter } from './router'
import https from 'https'
import env from '../env.json'
import fs from 'fs'
import http from 'http'
import express from 'express'

createExpressEndpoints(contracts, createTranscriptionRouter, app)

const port = env.port

// https://itnext.io/node-express-letsencrypt-generate-a-free-ssl-certificate-and-run-an-https-server-in-5-minutes-a730fbe528ca

if (env.production) {
    app.use(express.static(__dirname, { dotfiles: 'allow' }))
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
