import { z } from 'zod'

export const editChapterTitleSchema = z.object({
	id: z.string().min(1, 'Chapter ID is required'),
	courseId: z.string().min(1, 'Course ID is required'),
	title: z.string().min(1, 'Title is required').max(128, 'Title must be less than 128 characters')
})

export type EditChapterTitleSchema = z.infer<typeof editChapterTitleSchema>
