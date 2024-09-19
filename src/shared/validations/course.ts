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

export const updateCodeSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	code: z.string().min(1, 'Code is required').max(16, 'Code must be less than 16 characters')
})
export type UpdateCodeSchema = z.infer<typeof updateCodeSchema>

export const updateTitleSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	title: z.string().min(1, 'Title is required').max(32, 'Title must be less than 32 characters')
})
export type UpdateTitleSchema = z.infer<typeof updateTitleSchema>

export const updateDescriptionSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	description: z.string().max(1024, 'Description must be less than 1024 characters').optional()
})
export type UpdateDescriptionSchema = z.infer<typeof updateDescriptionSchema>

export const updateImageSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	image: z.string().optional()
})
export type UpdateImageSchema = z.infer<typeof updateImageSchema>

export const updateCategorySchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	categoryId: z.string().min(1, 'Category ID is required')
})
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>
