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

// ---------------------------------------------------------------------------
// READ
// ---------------------------------------------------------------------------
//

// Find One Assessment Schema
export const findOneAssessmentSchema = z.object({
	assessmentId: z.string().min(1, 'Assessment ID is required')
})
export type FindOneAssessmentSchema = z.infer<typeof findOneAssessmentSchema>

// -----------------------------------------------------------------------------
// UPDATE
// -----------------------------------------------------------------------------
//

// Edit Assessment Shuffle Questions Schema
export const editShuffleQuestionsSchema = z.object({
	assessmentId: z.string().min(1, 'Assessment ID is required'),
	shuffleQuestions: z.boolean()
})
export type EditShuffleQuestionsSchema = z.infer<
	typeof editShuffleQuestionsSchema
>

// Edit Assessment Shuffle Options Schema
export const editShuffleOptionsSchema = z.object({
	assessmentId: z.string().min(1, 'Assessment ID is required'),
	shuffleOptions: z.boolean()
})
export type EditShuffleOptionsSchema = z.infer<typeof editShuffleOptionsSchema>

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

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------
//

// Delete Assessment Schema
export const deleteAssessmentSchema = z.object({
	assessmentId: z.string().min(1, 'Assessment ID is required')
})
export type DeleteAssessmentSchema = z.infer<typeof deleteAssessmentSchema>
