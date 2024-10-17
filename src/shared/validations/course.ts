import { Status } from '@prisma/client'
import { z } from 'zod'

export const addCourseSchema = z.object({
	code: z.string().min(1, 'Code is required').max(16, 'Code must be less than 16 characters'),
	title: z.string().min(1, 'Title is required').max(32, 'Title must be less than 32 characters')
})
export type AddCourseSchema = z.infer<typeof addCourseSchema>

export const deleteCourseSchema = z.object({
	id: z.string().min(1, 'Course ID is required')
})
export type DeleteCourseSchema = z.infer<typeof deleteCourseSchema>

export const editTokenSchema = z.object({
	id: z.string().min(1, 'Course ID is required'),
	token: z.string().min(1, 'Token is required').max(6, 'Token must be less than 6 characters')
})
export type EditTokenSchema = z.infer<typeof editTokenSchema>

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

export const editStatusSchema = z.object({
	id: z.string().min(1, 'Course ID is required'),
	status: z.nativeEnum(Status)
})
export type EditStatusSchema = z.infer<typeof editStatusSchema>

export const getCourseSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required')
})
export type GetCourseSchema = z.infer<typeof getCourseSchema>
