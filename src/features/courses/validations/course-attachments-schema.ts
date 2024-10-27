import { z } from 'zod'

export const addCourseAttachmentSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	url: z.string().min(1, 'Attachment URL is required'),
	name: z.string().min(1, 'Attachment name is required')
})

export type AddCourseAttachmentSchema = z.infer<typeof addCourseAttachmentSchema>

export const deleteCourseAttachmentSchema = z.object({
	attachmentId: z.string().min(1, 'Attachment ID is required')
})

export type DeleteCourseAttachmentSchema = z.infer<typeof deleteCourseAttachmentSchema>
