import { z } from 'zod'

export const resetPasswordSchema = z.object({
	password: z.string().min(6, 'Mininum of 6 characters required'),
	token: z.string().nullable()
})

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
