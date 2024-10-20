import { Status } from '@prisma/client'
import { z } from 'zod'

export const editChapterStatusSchema = z.object({
	id: z.string().min(1, 'Chapter ID is required'),
	courseId: z.string().min(1, 'Course ID is required'),
	status: z.nativeEnum(Status)
})
export type EditChapterStatusSchema = z.infer<typeof editChapterStatusSchema>
