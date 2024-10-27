import { z } from 'zod'

export const editCourseTokenSchema = z.object({
	id: z.string().min(1, 'Course ID is required'),
	token: z
		.string()
		.length(6, 'Token must be exactly 6 characters')
		.regex(/^[a-zA-Z0-9]+$/, 'Token must only contain letters and numbers')
		.or(z.literal(''))
})

export type EditCourseTokenSchema = z.infer<typeof editCourseTokenSchema>
