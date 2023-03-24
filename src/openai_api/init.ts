import { Configuration, OpenAIApi } from 'openai'
import env from '../../env.json'

const configuration = new Configuration({
    apiKey: env.openAI.key,
})
export const openAI = new OpenAIApi(configuration)
