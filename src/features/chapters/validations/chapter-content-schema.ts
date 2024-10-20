import { z } from 'zod'

export const editChapterContentSchema = z.object({
	id: z.string().min(1, 'Chapter ID is required'),
	courseId: z.string().min(1, 'Course ID is required'),
	content: z.string().nullable()
})

export type EditChapterContentSchema = z.infer<typeof editChapterContentSchema>
