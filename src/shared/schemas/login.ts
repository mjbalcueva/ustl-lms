import { z } from 'zod'

export const loginSchema = z.object({
	email: z
		.string()
		.email('Email is required')
		.refine((email) => email.endsWith('@ust-legazpi.edu.ph'), {
			message: 'Emails must end with @ust-legazpi.edu.ph'
		}),
	password: z.string().min(1, 'Password is required'),
	code: z.string().optional()
})

export type LoginSchema = z.infer<typeof loginSchema>
