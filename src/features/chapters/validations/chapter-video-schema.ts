import { z } from 'zod'

export const editChapterVideoSchema = z.object({
	id: z.string().min(1, 'Chapter ID is required'),
	courseId: z.string().min(1, 'Course ID is required'),
	videoUrl: z.string().nullable()
})

export type EditChapterVideoSchema = z.infer<typeof editChapterVideoSchema>
