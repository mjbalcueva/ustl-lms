import { z } from 'zod'

export const enrollmentSchema = z.object({
	token: z
		.string()
		.length(6, 'Token must be exactly 6 characters')
		.regex(/^[a-zA-Z0-9]+$/, 'Token must only contain letters and numbers')
})
export type EnrollmentSchema = z.infer<typeof enrollmentSchema>
