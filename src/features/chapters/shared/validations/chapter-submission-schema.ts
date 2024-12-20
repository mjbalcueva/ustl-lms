import { z } from 'zod'

// -----------------------------------------------------------------------------
// CREATE
// -----------------------------------------------------------------------------
//

const attachmentSchema = z.object({
	name: z.string().min(1, 'Attachment name is required'),
	url: z.string().url('Invalid attachment URL')
})

// Add Chapter Assignment Submission Content Schema
export const addSubmissionContentSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required'),
	content: z.string().min(1, 'Content is required'),
	attachments: z.array(attachmentSchema).optional()
})
export type AddSubmissionContentSchema = z.infer<
	typeof addSubmissionContentSchema
>

// -----------------------------------------------------------------------------
// READ
// -----------------------------------------------------------------------------
//

// Find One Chapter Assignment Submission Schema
export const findOneSubmissionSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required')
})
export type FindOneSubmissionSchema = z.infer<typeof findOneSubmissionSchema>

// -----------------------------------------------------------------------------
// UPDATE
// -----------------------------------------------------------------------------
//

// Edit Chapter Assignment Submission Content Schema
export const editSubmissionContentSchema = z.object({
	submissionId: z.string().min(1, 'Submission ID is required'),
	content: z.string().min(1, 'Content is required'),
	attachments: z.array(attachmentSchema).optional()
})
export type EditSubmissionContentSchema = z.infer<
	typeof editSubmissionContentSchema
>
