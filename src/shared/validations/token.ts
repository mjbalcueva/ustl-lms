import { z } from 'zod'

export const tokenSchema = z.object({ token: z.string().nullable() })
