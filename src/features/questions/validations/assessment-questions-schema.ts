import { QuestionType } from '@prisma/client'
import { z } from 'zod'

export const aiAssessmentQuestionSchema = z.object({
	assessmentId: z.string().min(1, 'Assessment ID is required'),
	chapters: z.array(z.string()).min(1, 'At least one chapter is required'),
	questionType: z.nativeEnum(QuestionType, {
		required_error: 'Please select a question type'
	}),
	numberOfQuestions: z.number().min(1).max(10),
	additionalPrompt: z.string().optional()
})

export type AiAssessmentQuestionSchema = z.infer<typeof aiAssessmentQuestionSchema>

// Create shared type-specific schemas
const multipleChoiceSchema = {
	options: z.array(z.string()).min(2, 'At least 2 options required'),
	answer: z.string()
}

const multipleSelectSchema = {
	options: z.array(z.string()).min(2, 'At least 2 options required'),
	answer: z.array(z.string())
}

const trueOrFalseSchema = {
	options: z.tuple([z.literal('True'), z.literal('False')]),
	answer: z.union([z.literal('True'), z.literal('False')])
}

export const addAssessmentQuestionSchema = z.object({
	assessmentId: z.string().min(1, 'Assessment ID is required'),
	type: z.nativeEnum(QuestionType),
	question: z.string().min(1, 'Question is required'),
	options: z.preprocess(
		(val) => (typeof val === 'string' ? JSON.parse(val) : val),
		z.discriminatedUnion('type', [
			z.object({ type: z.literal(QuestionType.MULTIPLE_CHOICE), ...multipleChoiceSchema }),
			z.object({ type: z.literal(QuestionType.MULTIPLE_SELECT), ...multipleSelectSchema }),
			z.object({ type: z.literal(QuestionType.TRUE_OR_FALSE), ...trueOrFalseSchema })
		])
	),
	points: z.number().min(0.5, 'Points must be at least 0.5')
})

export type AddAssessmentQuestionSchema = z.infer<typeof addAssessmentQuestionSchema>

export const editAssessmentQuestionOrderSchema = z.object({
	assessmentId: z.string().min(1, 'Assessment ID is required'),
	questionList: z.array(
		z.object({
			id: z.string().min(1, 'Question ID is required'),
			position: z.number()
		})
	)
})

export type EditAssessmentQuestionOrderSchema = z.infer<typeof editAssessmentQuestionOrderSchema>

export const editAssessmentQuestionSchema = z.object({
	id: z.string(),
	assessmentId: z.string().min(1, 'Assessment ID is required'),
	type: z.nativeEnum(QuestionType),
	question: z.string().min(1, 'Question is required'),
	options: z.preprocess(
		(val) => (typeof val === 'string' ? JSON.parse(val) : val),
		z.discriminatedUnion('type', [
			z.object({ type: z.literal(QuestionType.MULTIPLE_CHOICE), ...multipleChoiceSchema }),
			z.object({ type: z.literal(QuestionType.MULTIPLE_SELECT), ...multipleSelectSchema }),
			z.object({ type: z.literal(QuestionType.TRUE_OR_FALSE), ...trueOrFalseSchema })
		])
	),
	points: z.number().min(0.5, 'Points must be at least 0.5')
})

export type EditAssessmentQuestionSchema = z.infer<typeof editAssessmentQuestionSchema>

export const deleteAssessmentQuestionSchema = z.object({
	id: z.string().min(1, 'Question ID is required')
})

export type DeleteAssessmentQuestionSchema = z.infer<typeof deleteAssessmentQuestionSchema>
