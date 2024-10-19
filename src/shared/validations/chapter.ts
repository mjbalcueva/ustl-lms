import { ChapterType, Status } from '@prisma/client'
import { z } from 'zod'

export const addChapterSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	title: z.string().min(1, 'Title is required').max(128, 'Title must be less than 128 characters'),
	type: z.nativeEnum(ChapterType)
})
export type AddChapterSchema = z.infer<typeof addChapterSchema>

export const deleteChapterSchema = z.object({
	id: z.string().min(1, 'Chapter ID is required')
})
export type DeleteChapterSchema = z.infer<typeof deleteChapterSchema>

export const editContentSchema = z.object({
	id: z.string().min(1, 'Chapter ID is required'),
	courseId: z.string().min(1, 'Course ID is required'),
	content: z.string().nullable()
})
export type EditContentSchema = z.infer<typeof editContentSchema>

export const editStatusSchema = z.object({
	id: z.string().min(1, 'Chapter ID is required'),
	courseId: z.string().min(1, 'Course ID is required'),
	status: z.nativeEnum(Status)
})
export type EditStatusSchema = z.infer<typeof editStatusSchema>

export const editTitleSchema = z.object({
	id: z.string().min(1, 'Chapter ID is required'),
	courseId: z.string().min(1, 'Course ID is required'),
	title: z.string().min(1, 'Title is required').max(128, 'Title must be less than 128 characters')
})
export type EditTitleSchema = z.infer<typeof editTitleSchema>

export const editTypeSchema = z.object({
	id: z.string().min(1, 'Chapter ID is required'),
	courseId: z.string().min(1, 'Course ID is required'),
	type: z.nativeEnum(ChapterType)
})
export type EditTypeSchema = z.infer<typeof editTypeSchema>

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
