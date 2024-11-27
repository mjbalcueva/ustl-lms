import { z } from 'zod'

// -----------------------------------------------------------------------------
// CREATE
// -----------------------------------------------------------------------------
//

// Add Chapter Assessment Schema
export const addChapterAssessmentSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required'),
	title: z
		.string()
		.min(1, 'Title is required')
		.max(128, 'Title must be less than 128 characters')
})
export type AddChapterAssessmentSchema = z.infer<
	typeof addChapterAssessmentSchema
>

// -----------------------------------------------------------------------------
// UPDATE
// -----------------------------------------------------------------------------
//

// Edit Chapter Assessment Order Schema
export const editChapterAssessmentOrderSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required'),
	assessmentList: z.array(
		z.object({
			assessmentId: z.string().min(1, 'Assessment ID is required'),
			position: z.number()
		})
	)
})
export type EditChapterAssessmentOrderSchema = z.infer<
	typeof editChapterAssessmentOrderSchema
>
