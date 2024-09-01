import { z } from 'zod'

const movieSchema = z.object({
    time: z.number(),
    movies: z.array(
        z.object({
            id: z.number().min(0),
            title: z.string(),
            overview: z.string(),
            genres: z.array(z.string()),
            poster: z.string(),
            release_date: z.number(),
        })
    ),
})

export type MoviesSchema = z.infer<typeof movieSchema>

export const getMovies = {
    method: 'GET',
    path: '/getMovies',
    query: z.object({
        query: z.string(),
    }),
    responses: {
        200: movieSchema,
        401: z.object({
            message: z.string(),
        }),
        500: z.object({
            message: z.string(),
        }),
    },
} as const
