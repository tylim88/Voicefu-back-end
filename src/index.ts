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
    const privateKey = fs.readFileSync(
        '/etc/letsencrypt/live/yourdomain.com/privkey.pem',
        'utf8'
    )
    const certificate = fs.readFileSync(
        '/etc/letsencrypt/live/yourdomain.com/cert.pem',
        'utf8'
    )
    const ca = fs.readFileSync(
        '/etc/letsencrypt/live/yourdomain.com/chain.pem',
        'utf8'
    )

    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca,
    }
    app.use(express.static(__dirname, { dotfiles: 'allow' }))
    https.createServer(credentials, app).listen(port, () => {
        console.info(`(https)Listening at port ${port}`)
    })
}
http.createServer(app).listen(port, () => {
    console.info(`(http)Listening at port ${port}`)
})
