import { z } from 'zod'

export const registerSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z
		.string()
		.email('Email is required')
		.refine((email) => email.endsWith('@ust-legazpi.edu.ph'), {
			message: 'Please use your UST Legazpi email address.'
		}),
	password: z.string().min(6, 'Mininum of 6 characters required')
})

export type RegisterSchema = z.infer<typeof registerSchema>
