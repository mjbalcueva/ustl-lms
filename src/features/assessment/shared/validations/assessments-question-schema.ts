import { AssessmentQuestionType } from '@prisma/client'
import { z } from 'zod'

// -----------------------------------------------------------------------------
// UTILITIES
// -----------------------------------------------------------------------------
//

// Multiple Choice Schema
const multipleChoiceSchema = {
	options: z.array(z.string()).min(2, 'At least 2 options required'),
	answer: z.string()
}

// Multiple Select Schema
const multipleSelectSchema = {
	options: z.array(z.string()).min(2, 'At least 2 options required'),
	answer: z.array(z.string())
}

// True or False Schema
const trueOrFalseSchema = {
	options: z.tuple([z.literal('True'), z.literal('False')]),
	answer: z.union([z.literal('True'), z.literal('False')])
}

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

// Add Assessment Question Schema
export const addAssessmentQuestionSchema = z.object({
	assessmentId: z.string().min(1, 'Assessment ID is required'),
	questionType: z.nativeEnum(AssessmentQuestionType),
	question: z.string().min(1, 'Question is required'),
	options: z.preprocess(
		(val) => (typeof val === 'string' ? JSON.parse(val) : val),
		z.discriminatedUnion('type', [
			z.object({
				type: z.literal(AssessmentQuestionType.MULTIPLE_CHOICE),
				...multipleChoiceSchema
			}),
			z.object({
				type: z.literal(AssessmentQuestionType.MULTIPLE_SELECT),
				...multipleSelectSchema
			}),
			z.object({
				type: z.literal(AssessmentQuestionType.TRUE_OR_FALSE),
				...trueOrFalseSchema
			})
		])
	),
	points: z.number().min(0.5, 'Points must be at least 0.5')
})
export type AddAssessmentQuestionSchema = z.infer<
	typeof addAssessmentQuestionSchema
>

// Generate AI Assessment Question Schema
export const generateAiAssessmentQuestionSchema = z.object({
	assessmentId: z.string().min(1, 'Assessment ID is required'),
	chapters: z
		.array(
			z.object({
				id: z.string(),
				title: z.string(),
				content: z.string()
			})
		)
		.min(1, 'At least one chapter is required'),
	questionType: z.nativeEnum(AssessmentQuestionType, {
		required_error: 'Please select a question type'
	}),
	numberOfQuestions: z.number().min(1).max(20),
	additionalPrompt: z.string().optional()
})
export type GenerateAiAssessmentQuestionSchema = z.infer<
	typeof generateAiAssessmentQuestionSchema
>

// AI Generated Question Schema
export const aiGeneratedQuestionSchema = z.object({
	question: z.string(),
	options: z.array(z.string()),
	answer: z.union([z.string(), z.array(z.string())]),
	points: z.number()
})

// AI Response Schema
export const aiResponseSchema = z.object({
	questions: z.array(aiGeneratedQuestionSchema)
})
// ---------------------------------------------------------------------------
// READ
// ---------------------------------------------------------------------------
//

// -----------------------------------------------------------------------------
// UPDATE
// -----------------------------------------------------------------------------
//

// Edit Assessment Question Order Schema
export const editAssessmentQuestionOrderSchema = z.object({
	assessmentId: z.string().min(1, 'Assessment ID is required'),
	questionList: z.array(z.object({ id: z.string(), position: z.number() }))
})
export type EditAssessmentQuestionOrderSchema = z.infer<
	typeof editAssessmentQuestionOrderSchema
>

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------
//
