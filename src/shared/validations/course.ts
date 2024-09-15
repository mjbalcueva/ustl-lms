import { z } from 'zod'

export const createCourseSchema = z.object({
	code: z.string().min(1, 'Code is required').max(16, 'Code must be less than 16 characters'),
	title: z.string().min(1, 'Title is required').max(32, 'Title must be less than 32 characters')
})

export type CreateCourseSchema = z.infer<typeof createCourseSchema>

export const getCoursesSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required')
})

export type GetCoursesSchema = z.infer<typeof getCoursesSchema>
