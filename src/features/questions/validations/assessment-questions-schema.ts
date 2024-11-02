import { QuestionType } from '@prisma/client'
import { z } from 'zod'

export const addAssessmentQuestionsSchema = z.object({
	assessmentId: z.string().min(1, 'Assessment ID is required'),
	type: z.nativeEnum(QuestionType),
	question: z.string().min(1, 'Question is required'),
	options: z.preprocess(
		(val) => (typeof val === 'string' ? JSON.parse(val) : val),
		z.record(z.string(), z.string().min(1, 'Option text is required')).optional()
	),
	correctAnswer: z.preprocess(
		(val) => (typeof val === 'string' ? JSON.parse(val) : val),
		z.union([
			z.object({
				type: z.literal(QuestionType.MULTIPLE_CHOICE),
				answer: z.string()
			}),
			z.object({
				type: z.literal(QuestionType.MULTIPLE_SELECT),
				answer: z.record(z.string(), z.boolean())
			}),
			z.object({
				type: z.literal(QuestionType.TRUE_OR_FALSE),
				answer: z.boolean()
			}),
			z.object({
				type: z.literal(QuestionType.ESSAY),
				answer: z.string()
			})
		])
	),
	points: z.number().min(1, 'Points must be greater than 0')
})

export type AddAssessmentQuestionsSchema = z.infer<typeof addAssessmentQuestionsSchema>

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
