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

// Filter Courses Schema
export const filterCoursesSchema = z.object({
	title: z.string().optional()
})
export type FilterCoursesSchema = z.infer<typeof filterCoursesSchema>

// -----------------------------------------------------------------------------
// UPDATE
// -----------------------------------------------------------------------------
//

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
