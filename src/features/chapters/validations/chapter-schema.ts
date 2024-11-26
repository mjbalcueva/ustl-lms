import { z } from 'zod'

export const findChapterSchema = z.object({
	id: z.string().min(1, 'Chapter ID is required'),
	courseId: z.string().min(1, 'Course ID is required')
})

export type FindChapterSchema = z.infer<typeof findChapterSchema>

export const deleteChapterSchema = z.object({
	id: z.string().min(1, 'Chapter ID is required')
})

export type DeleteChapterSchema = z.infer<typeof deleteChapterSchema>

export const toggleChapterCompletionSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required')
})

export type ToggleChapterCompletionSchema = z.infer<typeof toggleChapterCompletionSchema>
