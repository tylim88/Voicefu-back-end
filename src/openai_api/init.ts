import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY as string,
})
export const openAI = new OpenAIApi(configuration)
