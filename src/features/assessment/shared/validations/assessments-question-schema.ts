import { AssessmentQuestionType } from '@prisma/client'
import { z } from 'zod'

// -----------------------------------------------------------------------------
// UTILITIES
// -----------------------------------------------------------------------------
//

// Multiple Choice Schema
const multipleChoiceSchema = z.object({
	type: z.literal('MULTIPLE_CHOICE'),
	options: z.array(z.string()).min(2, 'At least 2 options required'),
	answer: z.string()
})
export type MultipleChoiceSchema = z.infer<typeof multipleChoiceSchema>

// Multiple Select Schema
const multipleSelectSchema = z.object({
	type: z.literal('MULTIPLE_SELECT'),
	options: z.array(z.string()).min(2, 'At least 2 options required'),
	answer: z.array(z.string())
})
export type MultipleSelectSchema = z.infer<typeof multipleSelectSchema>

// True or False Schema
const trueOrFalseSchema = z.object({
	type: z.literal('TRUE_OR_FALSE'),
	options: z.tuple([z.literal('True'), z.literal('False')]),
	answer: z.union([z.literal('True'), z.literal('False')])
})
export type TrueOrFalseSchema = z.infer<typeof trueOrFalseSchema>

// Question Options Schema
export const questionOptionsSchema = z.discriminatedUnion('type', [
	multipleChoiceSchema,
	multipleSelectSchema,
	trueOrFalseSchema
])
export type QuestionOptions = z.infer<typeof questionOptionsSchema>

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
	questionType: z.nativeEnum(AssessmentQuestionType, {
		required_error: 'Please select a question type'
	}),
	question: z.string().min(1, 'Question is required'),
	options: questionOptionsSchema,
	points: z.number().min(0.5, 'Points must be at least 0.5')
})
export type AddAssessmentQuestionSchema = z.infer<
	typeof addAssessmentQuestionSchema
>

// Generate AI Assessment Question Schema
export const generateAssessmentQuestionSchema = z.object({
	assessmentId: z.string().min(1, 'Assessment ID is required'),
	chapters: z
		.array(
			z.object({
				chapterId: z.string(),
				title: z.string(),
				content: z.string()
			})
		)
		.min(1, 'At least one chapter is required'),
	questionType: z.nativeEnum(AssessmentQuestionType, {
		required_error: 'Please select a question type'
	}),
	numberOfQuestions: z.number().min(1).max(10),
	additionalPrompt: z.string().optional()
})
export type GenerateAssessmentQuestionSchema = z.infer<
	typeof generateAssessmentQuestionSchema
>

// Generated AI Question Schema
export const generatedAIQuestionSchema = z.object({
	question: z.string(),
	options: z.array(z.string()),
	answer: z.union([z.string(), z.array(z.string())]),
	points: z.number()
})
export type GeneratedQuestionSchema = z.infer<typeof generatedAIQuestionSchema>

// AI Response Schema
export const aiResponseSchema = z.object({
	questions: z.array(generatedAIQuestionSchema)
})
export type AiResponseSchema = z.infer<typeof aiResponseSchema>

// ---------------------------------------------------------------------------
// READ
// ---------------------------------------------------------------------------
//

// -----------------------------------------------------------------------------
// UPDATE
// -----------------------------------------------------------------------------
//

// Edit Assessment Question Schema
export const editAssessmentQuestionSchema = addAssessmentQuestionSchema.extend({
	questionId: z.string().min(1, 'Question ID is required'),
	questionType: z.nativeEnum(AssessmentQuestionType, {
		required_error: 'Please select a question type'
	}),
	question: z.string().min(1, 'Question is required'),
	options: questionOptionsSchema,
	points: z.number().min(0, 'Points must be at least 0')
})
export type EditAssessmentQuestionSchema = z.infer<
	typeof editAssessmentQuestionSchema
>

// Edit Assessment Question Order Schema
export const editAssessmentQuestionOrderSchema = z.object({
	assessmentId: z.string().min(1, 'Assessment ID is required'),
	questionList: z.array(
		z.object({ questionId: z.string(), position: z.number() })
	)
})
export type EditAssessmentQuestionOrderSchema = z.infer<
	typeof editAssessmentQuestionOrderSchema
>

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------
//

// Delete Assessment Question Schema
export const deleteAssessmentQuestionSchema = z.object({
	questionId: z.string().min(1, 'Question ID is required')
})
export type DeleteAssessmentQuestionSchema = z.infer<
	typeof deleteAssessmentQuestionSchema
>
