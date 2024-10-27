import { z } from 'zod'

export const editPasswordSchema = z
	.object({
		currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
		newPassword: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string().min(6, 'Password must be at least 6 characters')
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	})

export type EditPasswordSchema = z.infer<typeof editPasswordSchema>
