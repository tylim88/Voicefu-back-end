import { contracts } from './contracts'
import { app } from './server'
import { createExpressEndpoints } from '@ts-rest/express'
import { createTranscriptionRouter } from './router'

createExpressEndpoints(contracts, createTranscriptionRouter, app)

const port = process.env.port || 3001
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})
