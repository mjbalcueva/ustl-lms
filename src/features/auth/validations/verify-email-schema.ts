import { z } from 'zod'

export const verifyEmailSchema = z.object({ token: z.string().optional() })

export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>
