import { z } from 'zod'

export const loginSchema = z.object({
	email: z
		.string()
		.email('Email is required')
		.refine((email) => email.endsWith('@ust-legazpi.edu.ph'), {
			message: 'Please use your UST Legazpi email address.'
		}),
	password: z.string().min(1, 'Password is required'),
	code: z.string().optional()
})

export type LoginSchema = z.infer<typeof loginSchema>
