import { z } from 'zod'

export const newPasswordSchema = z.object({
	password: z.string().min(6, 'Mininum of 6 characters required')
})

export type NewPasswordSchema = z.infer<typeof newPasswordSchema>
