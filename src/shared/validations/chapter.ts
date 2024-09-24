import { z } from 'zod'

export const createChapterSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	title: z.string().min(1, 'Title is required').max(32, 'Title must be less than 32 characters')
})
export type CreateChapterSchema = z.infer<typeof createChapterSchema>

export const editDescriptionSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required'),
	description: z.string().min(1, 'Description is required').max(32, 'Description must be less than 32 characters')
})
export type EditDescriptionSchema = z.infer<typeof editDescriptionSchema>

export const editTitleSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required'),
	title: z.string().min(1, 'Title is required').max(32, 'Title must be less than 32 characters')
})
export type EditTitleSchema = z.infer<typeof editTitleSchema>

export const getChapterSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required')
})
export type GetChapterSchema = z.infer<typeof getChapterSchema>

export const reorderChaptersSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	chapterList: z.array(
		z.object({
			id: z.string().min(1, 'Chapter ID is required'),
			position: z.number()
		})
	)
})
export type ReorderChaptersSchema = z.infer<typeof reorderChaptersSchema>
