import { ChapterType } from '@prisma/client'
import { z } from 'zod'

export const addCourseChapterSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	title: z.string().min(1, 'Title is required').max(128, 'Title must be less than 128 characters'),
	type: z.nativeEnum(ChapterType)
})

export type AddCourseChapterSchema = z.infer<typeof addCourseChapterSchema>

export const editCourseChapterOrderSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	chapterList: z.array(
		z.object({
			id: z.string().min(1, 'Chapter ID is required'),
			position: z.number()
		})
	)
})
export type EditCourseChapterOrderSchema = z.infer<typeof editCourseChapterOrderSchema>
