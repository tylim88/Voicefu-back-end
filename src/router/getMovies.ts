import { contracts, type MoviesSchema } from '../contracts'
import { type AppRouteImplementation } from '@ts-rest/express'
import { MeiliSearch } from 'meilisearch'
import movies from '../../movies.json'
import { meilisearch } from '../../env.json'
import axios from 'axios'

type Movie = MoviesSchema['movies'] extends (infer R)[] ? R : never
const name = 'movies'
const host = 'http://127.0.0.1:7700'
const apiKey = meilisearch.masterKey
const client = new MeiliSearch({
    host,
    apiKey,
})
const limit = 1000
// An index is where the documents are stored.
const index = client.index<Movie>(name)
;(async () => {
    await index.addDocuments(movies as Movie[]).catch(console.error)
    await index
        .updateFilterableAttributes(['title', 'overview'])
        .catch(console.error)
    await axios
        .patch(
            `${host}/indexes/${name}/settings/pagination`,
            {
                maxTotalHits: limit,
            },
            {
                headers: {
                    Authorization: 'Bearer ' + apiKey,
                },
            }
        )
        .catch(console.error)
})()

export const getMovies: AppRouteImplementation<
    (typeof contracts)['getMovies']
> = async ({ req }) => {
    const {
        query: { query },
    } = req
    const start = new Date()
    const search = await index.search(query, { limit })
    const end = new Date()
    return {
        status: 200,
        body: { movies: search.hits, time: end.valueOf() - start.valueOf() },
    }
}
