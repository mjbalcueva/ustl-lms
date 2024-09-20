import { z } from 'zod'

export const addPasswordSchema = z
	.object({
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string().min(6, 'Password must be at least 6 characters')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	})

export type AddPasswordSchema = z.infer<typeof addPasswordSchema>
