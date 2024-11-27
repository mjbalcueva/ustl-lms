import { z } from 'zod'

// -----------------------------------------------------------------------------
// CREATE
// -----------------------------------------------------------------------------
//

// Add Chapter Attachment Schema
export const addChapterAttachmentSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required'),
	name: z.string().min(1, 'Attachment name is required'),
	url: z.string().min(1, 'Attachment URL is required')
})
export type AddChapterAttachmentSchema = z.infer<
	typeof addChapterAttachmentSchema
>

// -----------------------------------------------------------------------------
// UPDATE
// -----------------------------------------------------------------------------
//

// -----------------------------------------------------------------------------
// DELETE
// -----------------------------------------------------------------------------
//

// Delete Chapter Attachment Schema
export const deleteChapterAttachmentSchema = z.object({
	attachmentId: z.string().min(1, 'Attachment ID is required')
})
export type DeleteChapterAttachmentSchema = z.infer<
	typeof deleteChapterAttachmentSchema
>
