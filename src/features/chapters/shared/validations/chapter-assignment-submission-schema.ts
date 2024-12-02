import { z } from 'zod'

// -----------------------------------------------------------------------------
// UPDATE
// -----------------------------------------------------------------------------
//

// Edit Chapter Assignment Submission Schema
export const editAssignmentSubmissionSchema = z.object({
	chapterId: z.string().min(1),
	content: z.string().min(1, 'Content is required')
})
export type EditAssignmentSubmissionSchema = z.infer<
	typeof editAssignmentSubmissionSchema
>
