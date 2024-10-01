import { z } from 'zod'

export const addCourseSchema = z.object({
	code: z.string().min(1, 'Code is required').max(16, 'Code must be less than 16 characters'),
	title: z.string().min(1, 'Title is required').max(32, 'Title must be less than 32 characters')
})
export type AddCourseSchema = z.infer<typeof addCourseSchema>

export const getCourseSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required')
})
export type GetCourseSchema = z.infer<typeof getCourseSchema>

export const editCodeSchema = z.object({
	id: z.string().min(1, 'Course ID is required'),
	code: z.string().min(1, 'Code is required').max(16, 'Code must be less than 16 characters')
})
export type EditCodeSchema = z.infer<typeof editCodeSchema>

export const editTitleSchema = z.object({
	id: z.string().min(1, 'Course ID is required'),
	title: z.string().min(1, 'Title is required').max(32, 'Title must be less than 32 characters')
})
export type EditTitleSchema = z.infer<typeof editTitleSchema>

export const editDescriptionSchema = z.object({
	id: z.string().min(1, 'Course ID is required'),
	description: z.string().max(1024, 'Description must be less than 1024 characters').nullable()
})
export type EditDescriptionSchema = z.infer<typeof editDescriptionSchema>

export const editImageSchema = z.object({
	id: z.string().min(1, 'Course ID is required'),
	imageUrl: z.string().nullable()
})
export type EditImageSchema = z.infer<typeof editImageSchema>

export const toggleCoursePublishSchema = z.object({
	id: z.string().min(1, 'Course ID is required'),
	isPublished: z.boolean()
})
export type ToggleCoursePublishSchema = z.infer<typeof toggleCoursePublishSchema>
