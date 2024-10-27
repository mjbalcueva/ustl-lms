import { z } from 'zod'

export const findCourseSchema = z.object({
	courseId: z.string().cuid('Must be an id!')
})

export type FindCourseSchema = z.infer<typeof findCourseSchema>

export const addCourseSchema = z.object({
	code: z.string().min(1, 'Code is required').max(16, 'Code must be less than 16 characters'),
	title: z.string().min(1, 'Title is required').max(128, 'Title must be less than 128 characters')
})

export type AddCourseSchema = z.infer<typeof addCourseSchema>

export const deleteCourseSchema = z.object({
	id: z.string().min(1, 'Course ID is required')
})

export type DeleteCourseSchema = z.infer<typeof deleteCourseSchema>
