import { z } from 'zod'

// -----------------------------------------------------------------------------
// CREATE
// -----------------------------------------------------------------------------
//

// Add Assessment Answer Schema
export const addAssessmentAnswerSchema = z.object({
	questionId: z.string().min(1, 'Question ID is required'),
	answer: z.union([z.string(), z.array(z.string())])
})
export type AddAssessmentAnswerSchema = z.infer<
	typeof addAssessmentAnswerSchema
>

// Submit Assessment Schema
export const submitAssessmentSchema = z.object({
	assessmentId: z.string().min(1, 'Assessment ID is required'),
	answers: z.array(addAssessmentAnswerSchema)
})
export type SubmitAssessmentSchema = z.infer<typeof submitAssessmentSchema>

// -----------------------------------------------------------------------------
// READ
// -----------------------------------------------------------------------------
//

// Find One Assessment Submission Schema
export const findOneAssessmentSubmissionSchema = z.object({
	assessmentId: z.string().min(1, 'Assessment ID is required')
})
export type FindOneAssessmentSubmissionSchema = z.infer<
	typeof findOneAssessmentSubmissionSchema
>

// -----------------------------------------------------------------------------
// UPDATE
// -----------------------------------------------------------------------------
//

// Edit Assessment Answer Schema
export const editAssessmentAnswerSchema = z.object({
	answerId: z.string().min(1, 'Answer ID is required'),
	answer: z.union([z.string(), z.array(z.string())])
})
export type EditAssessmentAnswerSchema = z.infer<
	typeof editAssessmentAnswerSchema
>
