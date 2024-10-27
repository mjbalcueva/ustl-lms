import { ChapterType } from '@prisma/client'
import { z } from 'zod'

export const editChapterTypeSchema = z.object({
	id: z.string().min(1, 'Chapter ID is required'),
	courseId: z.string().min(1, 'Course ID is required'),
	type: z.nativeEnum(ChapterType)
})

export type EditChapterTypeSchema = z.infer<typeof editChapterTypeSchema>
