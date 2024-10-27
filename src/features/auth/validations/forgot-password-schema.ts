import { z } from 'zod'

export const forgotPasswordSchema = z.object({
	email: z
		.string()
		.email('Email is required')
		.refine((email) => email.endsWith('@ust-legazpi.edu.ph'), {
			message: 'Please use your UST Legazpi email address.'
		})
})

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>
