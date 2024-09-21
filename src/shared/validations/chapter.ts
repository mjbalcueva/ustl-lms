import { z } from 'zod'

export const createChapterSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	title: z.string().min(1, 'Title is required').max(32, 'Title must be less than 32 characters')
})
export type CreateChapterSchema = z.infer<typeof createChapterSchema>

export const updateChapterSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	chapters: z.array(
		z.object({
			id: z.string().min(1, 'Chapter ID is required'),
			title: z.string().min(1, 'Title is required').max(32, 'Title must be less than 32 characters'),
			description: z.string().max(1024, 'Description must be less than 1024 characters').optional()
		})
	)
})
export type UpdateChapterSchema = z.infer<typeof updateChapterSchema>
