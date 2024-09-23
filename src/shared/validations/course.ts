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

export const editCourseCodeSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	code: z.string().min(1, 'Code is required').max(16, 'Code must be less than 16 characters')
})
export type EditCourseCodeSchema = z.infer<typeof editCourseCodeSchema>

export const editCourseTitleSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	title: z.string().min(1, 'Title is required').max(32, 'Title must be less than 32 characters')
})
export type EditCourseTitleSchema = z.infer<typeof editCourseTitleSchema>

export const editCourseDescriptionSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	description: z.string().max(1024, 'Description must be less than 1024 characters').optional()
})
export type EditCourseDescriptionSchema = z.infer<typeof editCourseDescriptionSchema>

export const updateImageSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	imageUrl: z.string().min(1, 'Image URL is required')
})
export type UpdateImageSchema = z.infer<typeof updateImageSchema>
