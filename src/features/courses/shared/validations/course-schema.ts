import { z } from 'zod'

// Add Course Schema
export const addCourseSchema = z.object({
	code: z
		.string()
		.min(1, 'Code is required')
		.max(16, 'Code must be less than 16 characters'),
	title: z
		.string()
		.min(1, 'Title is required')
		.max(128, 'Title must be less than 128 characters')
})
export type AddCourseSchema = z.infer<typeof addCourseSchema>

// Find One Course Schema
export const findOneCourseSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required')
})
export type FindOneCourseSchema = z.infer<typeof findOneCourseSchema>
