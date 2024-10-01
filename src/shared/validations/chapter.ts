import { z } from 'zod'

export const addChapterSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	title: z.string().min(1, 'Title is required').max(32, 'Title must be less than 32 characters')
})
export type AddChapterSchema = z.infer<typeof addChapterSchema>

export const editContentSchema = z.object({
	id: z.string().min(1, 'Chapter ID is required'),
	courseId: z.string().min(1, 'Course ID is required'),
	content: z.string().nullable()
})
export type EditContentSchema = z.infer<typeof editContentSchema>

export const editTitleSchema = z.object({
	id: z.string().min(1, 'Chapter ID is required'),
	courseId: z.string().min(1, 'Course ID is required'),
	title: z.string().min(1, 'Title is required').max(32, 'Title must be less than 32 characters')
})
export type EditTitleSchema = z.infer<typeof editTitleSchema>

export const editVideoSchema = z.object({
	id: z.string().min(1, 'Chapter ID is required'),
	courseId: z.string().min(1, 'Course ID is required'),
	videoUrl: z.string().nullable()
})
export type EditVideoSchema = z.infer<typeof editVideoSchema>

export const getChapterSchema = z.object({
	id: z.string().min(1, 'Chapter ID is required'),
	courseId: z.string().min(1, 'Course ID is required')
})
export type GetChapterSchema = z.infer<typeof getChapterSchema>

export const chapterActionsSchema = z.object({
	id: z.string().min(1, 'Chapter ID is required'),
	courseId: z.string().min(1, 'Course ID is required'),
	isPublished: z.boolean()
})
export type ChapterActionsSchema = z.infer<typeof chapterActionsSchema>

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
