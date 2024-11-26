import { Status } from '@prisma/client'
import { z } from 'zod'

// -----------------------------------------------------------------------------
// CREATE
// -----------------------------------------------------------------------------
//

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

// -----------------------------------------------------------------------------
// READ
// -----------------------------------------------------------------------------
//

// Find One Course Schema
export const findOneCourseSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required')
})
export type FindOneCourseSchema = z.infer<typeof findOneCourseSchema>

// -----------------------------------------------------------------------------
// UPDATE
// -----------------------------------------------------------------------------
//

// Edit Course Code Schema
export const editCourseCodeSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	code: z
		.string()
		.min(1, 'Code is required')
		.max(16, 'Code must be less than 16 characters')
})
export type EditCourseCodeSchema = z.infer<typeof editCourseCodeSchema>

// Edit Course Title Schema
export const editCourseTitleSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	title: z
		.string()
		.min(1, 'Title is required')
		.max(128, 'Title must be less than 128 characters')
})
export type EditCourseTitleSchema = z.infer<typeof editCourseTitleSchema>

// Edit Course Token Schema
export const editCourseTokenSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	token: z
		.string()
		.length(6, 'Token must be exactly 6 characters')
		.regex(/^[a-zA-Z0-9]+$/, 'Token must only contain letters and numbers')
		.or(z.literal(''))
})
export type EditCourseTokenSchema = z.infer<typeof editCourseTokenSchema>

// Edit Status Schema
export const editStatusSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	status: z.nativeEnum(Status)
})
export type EditStatusSchema = z.infer<typeof editStatusSchema>

// -----------------------------------------------------------------------------
// DELETE
// -----------------------------------------------------------------------------
//

// Delete Course Schema
export const deleteCourseSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required')
})
export type DeleteCourseSchema = z.infer<typeof deleteCourseSchema>
