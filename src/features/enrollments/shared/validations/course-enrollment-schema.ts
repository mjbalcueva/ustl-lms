import { z } from 'zod'

// ---------------------------------------------------------------------------
// CREATE
// ---------------------------------------------------------------------------
//

// Enroll to Course by Token Schema
export const enrollToCourseSchema = z.object({
	token: z
		.string()
		.length(6, 'Token must be exactly 6 characters')
		.regex(/^[a-zA-Z0-9]+$/, 'Token must only contain letters and numbers')
})
export type EnrollToCourseSchema = z.infer<typeof enrollToCourseSchema>

// ---------------------------------------------------------------------------
// READ
// ---------------------------------------------------------------------------
//

// Find One Course by Token Schema
export const findOneCourseSchema = z.object({
	token: z
		.string()
		.length(6, 'Token must be exactly 6 characters')
		.regex(/^[a-zA-Z0-9]+$/, 'Token must only contain letters and numbers')
})
export type FindOneCourseSchema = z.infer<typeof findOneCourseSchema>
