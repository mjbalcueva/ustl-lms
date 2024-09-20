import { z } from 'zod'

export const createAttachmentSchema = z.object({
	courseId: z.string().min(1, 'Course ID is required'),
	attachmentUrl: z.string().min(1, 'Attachment URL is required')
})
export type CreateAttachmentSchema = z.infer<typeof createAttachmentSchema>

export const deleteAttachmentSchema = z.object({
	attachmentId: z.string().min(1, 'Attachment ID is required')
})
export type DeleteAttachmentSchema = z.infer<typeof deleteAttachmentSchema>
