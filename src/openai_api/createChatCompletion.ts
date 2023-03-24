import { openAI } from './init'
import { AxiosResponse } from 'openai/node_modules/axios'
import { CreateChatCompletionResponse } from 'openai'
export const createChatCompletion = ({
    systemContent,
    userContent,
    temperature,
    max_tokens,
    user,
    presence_penalty,
    frequency_penalty,
    logit_bias,
    n,
}: {
    systemContent?: string
    userContent: string
    temperature?: number
    max_tokens?: number
    user: string
    presence_penalty?: number
    frequency_penalty?: number
    logit_bias?: Record<string, number>
    n?: number
}): Promise<AxiosResponse<CreateChatCompletionResponse, any>> =>
    openAI.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content:
                    systemContent ||
                    'translate user content into Japanese language',
            },
            { role: 'user', content: userContent },
        ],
        temperature: temperature || null,
        max_tokens: max_tokens || 100,
        user,
        ...(presence_penalty && { presence_penalty }),
        ...(frequency_penalty && { frequency_penalty }),
        ...(logit_bias && { logit_bias }),
        ...(n && { n }),
    })
