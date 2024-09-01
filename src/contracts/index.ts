import { c } from './init'
import { createTranscription } from './createTranscription'
import { getMovies } from './getMovies'

export const contracts = c.router({
    createTranscription,
    getMovies,
})

export * from './getMovies'
export * from './createTranscription'
