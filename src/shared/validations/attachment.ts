import { z } from 'zod'

export const addCourseAttachmentSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	url: z.string().min(1, 'Attachment URL is required'),
	name: z.string().min(1, 'Attachment name is required')
})
export type AddCourseAttachmentSchema = z.infer<typeof addCourseAttachmentSchema>

export const addChapterAttachmentSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	chapterId: z.string().min(1, 'Chapter ID is required'),
	url: z.string().min(1, 'Attachment URL is required'),
	name: z.string().min(1, 'Attachment name is required')
})
export type AddChapterAttachmentSchema = z.infer<typeof addChapterAttachmentSchema>

export const deleteAttachmentSchema = z.object({
	attachmentId: z.string().min(1, 'Attachment ID is required')
})
export type DeleteAttachmentSchema = z.infer<typeof deleteAttachmentSchema>

export const deleteChapterAttachmentSchema = z.object({
	attachmentId: z.string().min(1, 'Attachment ID is required')
})
export type DeleteChapterAttachmentSchema = z.infer<typeof deleteChapterAttachmentSchema>
