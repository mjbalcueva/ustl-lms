import { z } from 'zod'

export const verifyEmailSchema = z.object({ token: z.string().nullable() })
