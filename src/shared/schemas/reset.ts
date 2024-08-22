import { z } from 'zod'

export const resetSchema = z.object({
	email: z
		.string()
		.email('Email is required')
		.refine((email) => email.endsWith('@ust-legazpi.edu.ph'), {
			message: 'Please use your UST Legazpi email address.'
		})
})

export type ResetSchema = z.infer<typeof resetSchema>
