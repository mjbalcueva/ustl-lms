import { ChapterType, Status } from '@prisma/client'
import { z } from 'zod'

// -----------------------------------------------------------------------------
// CREATE
// -----------------------------------------------------------------------------
//

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

/// -----------------------------------------------------------------------------
// DELETE
// -----------------------------------------------------------------------------
//

// Delete Chapter Schema
export const deleteChapterSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required')
})
export type DeleteChapterSchema = z.infer<typeof deleteChapterSchema>
