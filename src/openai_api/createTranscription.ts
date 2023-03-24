import { openAI } from './init'
import fs from 'fs'

export const createTranscription = ({
    file,
    prompt,
    temperature,
    language,
}: {
    file: fs.ReadStream
    prompt?: string
    temperature?: number
    language?: string
}) =>
    openAI.createTranscription(
        // @ts-expect-error https://github.com/openai/openai-node/issues/77
        file,
        'whisper-1',
        prompt,
        'json',
        temperature,
        language
    )
