import { z } from 'zod'

// -----------------------------------------------------------------------------
// UPDATE
// -----------------------------------------------------------------------------
//

// Edit Chapter Assignment Submission Schema
export const editAssignmentSubmissionSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required'),
	content: z.string(),
	attachments: z
		.array(
			z.object({
				name: z.string().min(1, 'Attachment name is required'),
				url: z.string().min(1, 'Attachment URL is required')
			})
		)
		.optional()
		.default([])
})
export type EditAssignmentSubmissionSchema = z.infer<
	typeof editAssignmentSubmissionSchema
>
