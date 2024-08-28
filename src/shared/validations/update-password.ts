import { z } from 'zod'

export const updatePasswordSchema = z
	.object({
		currentPassword: z.string().min(6, 'Password must be at least 6 characters').or(z.literal('')),
		newPassword: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string().min(6, 'Password must be at least 6 characters')
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	})

export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>
