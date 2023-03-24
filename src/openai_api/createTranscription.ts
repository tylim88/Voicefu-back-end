import { openAI } from './init'

export const createTranscription = ({
    file,
    prompt,
    temperature,
    language,
}: {
    file: File
    prompt?: string
    temperature?: number
    language?: string
}) =>
    openAI.createTranscription(
        file,
        'whisper-1',
        prompt,
        'json',
        temperature,
        language
    )
