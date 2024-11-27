import { z } from 'zod'

// -----------------------------------------------------------------------------
// CREATE
// -----------------------------------------------------------------------------
//

// Add Assessment Schema
export const addAssessmentSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required'),
	title: z
		.string()
		.min(1, 'Title is required')
		.max(128, 'Title must be less than 128 characters')
})
export type AddAssessmentSchema = z.infer<typeof addAssessmentSchema>

// -----------------------------------------------------------------------------
// UPDATE
// -----------------------------------------------------------------------------
//

// Edit Assessment Order Schema
export const editAssessmentOrderSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required'),
	assessmentList: z.array(
		z.object({
			assessmentId: z.string().min(1, 'Assessment ID is required'),
			position: z.number()
		})
	)
})
export type EditAssessmentOrderSchema = z.infer<
	typeof editAssessmentOrderSchema
>
