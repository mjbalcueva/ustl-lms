import { z } from 'zod'

// -----------------------------------------------------------------------------
// CREATE
// -----------------------------------------------------------------------------
//

// Add Chapter Assignment Submission Attachment Schema
export const addSubmissionAttachmentSchema = z.object({
	submissionId: z.string().min(1, 'Submission ID is required'),
	name: z.string().min(1, 'Attachment name is required'),
	url: z.string().min(1, 'Attachment URL is required')
})
export type AddSubmissionAttachmentSchema = z.infer<
	typeof addSubmissionAttachmentSchema
>

// -----------------------------------------------------------------------------
// DELETE
// -----------------------------------------------------------------------------
//

// Delete Chapter Assignment Submission Attachment Schema
export const deleteSubmissionAttachmentSchema = z.object({
	attachmentId: z.string().min(1, 'Attachment ID is required')
})
export type DeleteSubmissionAttachmentSchema = z.infer<
	typeof deleteSubmissionAttachmentSchema
>
