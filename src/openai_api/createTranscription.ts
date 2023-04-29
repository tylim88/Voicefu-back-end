import { openAI } from './init'
import fs from 'fs'

export const createTranscription = ({
    readStream: file,
    prompt,
    temperature,
    language,
}: {
    readStream: fs.ReadStream
    prompt?: string
    temperature?: number
    language?: string
}) =>
    openAI.createTranscription(
        // @ts-expect-error https://github.com/openai/openai-node/issues/77
        file,
        'whisper-1',
        prompt ||
            'The output text language must be the same as the speech language',
        'json',
        temperature,
        language
    )
