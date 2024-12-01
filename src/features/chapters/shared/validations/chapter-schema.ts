import { ChapterType, Status } from '@prisma/client'
import { z } from 'zod'

// -----------------------------------------------------------------------------
// CREATE
// -----------------------------------------------------------------------------
//

// Add Chapter
export const addChapterSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	title: z
		.string()
		.min(1, 'Title is required')
		.max(128, 'Title must be less than 128 characters'),
	type: z.nativeEnum(ChapterType)
})
export type AddChapterSchema = z.infer<typeof addChapterSchema>

// -----------------------------------------------------------------------------
// READ
// -----------------------------------------------------------------------------
//

// Find One Course Schema
export const findOneChapterSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required')
})
export type FindOneChapterSchema = z.infer<typeof findOneChapterSchema>

// -----------------------------------------------------------------------------
// UPDATE
// -----------------------------------------------------------------------------
//

// Edit Chapter Title Schema
export const editChapterTitleSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required'),
	title: z
		.string()
		.min(1, 'Title is required')
		.max(128, 'Title must be less than 128 characters')
})
export type EditChapterTitleSchema = z.infer<typeof editChapterTitleSchema>

// Edit Chapter Content Schema
export const editChapterContentSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required'),
	content: z.string().min(1, 'Content is required')
})
export type EditChapterContentSchema = z.infer<typeof editChapterContentSchema>

// Edit Chapter Video Schema
export const editChapterVideoSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required'),
	videoUrl: z.string().min(1, 'Video URL is required')
})
export type EditChapterVideoSchema = z.infer<typeof editChapterVideoSchema>

// Edit Chapter Type Schema
export const editChapterTypeSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required'),
	type: z.nativeEnum(ChapterType)
})
export type EditChapterTypeSchema = z.infer<typeof editChapterTypeSchema>

// Edit Chapter Status Schema
export const editChapterStatusSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required'),
	status: z.nativeEnum(Status)
})
export type EditChapterStatusSchema = z.infer<typeof editChapterStatusSchema>

// Edit Chapter Completion Schema
export const editChapterCompletionSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required')
})
export type EditChapterCompletionSchema = z.infer<
	typeof editChapterCompletionSchema
>

// Edit Chapter Order
export const editChapterOrderSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	chapterList: z.array(
		z.object({
			chapterId: z.string().min(1, 'Chapter ID is required'),
			position: z.number()
		})
	)
})
export type EditCourseChapterOrderSchema = z.infer<
	typeof editChapterOrderSchema
>

/// -----------------------------------------------------------------------------
// DELETE
// -----------------------------------------------------------------------------
//

// Delete Chapter Schema
export const deleteChapterSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required')
})
export type DeleteChapterSchema = z.infer<typeof deleteChapterSchema>

// Delete Chapter Video Schema
export const deleteChapterVideoSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required')
})
export type DeleteChapterVideoSchema = z.infer<typeof deleteChapterVideoSchema>
