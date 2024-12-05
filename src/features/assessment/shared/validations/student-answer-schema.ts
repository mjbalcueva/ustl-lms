import { z } from 'zod'

const baseAnswerSchema = {
	questionId: z.string(),
	questionType: z.enum(['MULTIPLE_CHOICE', 'MULTIPLE_SELECT', 'TRUE_OR_FALSE'])
}

const multipleChoiceAnswerSchema = z.object({
	...baseAnswerSchema,
	questionType: z.literal('MULTIPLE_CHOICE'),
	answer: z.string().min(1, 'Please select an answer')
})

const multipleSelectAnswerSchema = z.object({
	...baseAnswerSchema,
	questionType: z.literal('MULTIPLE_SELECT'),
	answer: z.array(z.string()).optional().default([])
})

const trueFalseAnswerSchema = z.object({
	...baseAnswerSchema,
	questionType: z.literal('TRUE_OR_FALSE'),
	answer: z.enum(['True', 'False'], {
		required_error: 'Please select an answer'
	})
})

const answerSchema = z.discriminatedUnion('questionType', [
	multipleChoiceAnswerSchema,
	multipleSelectAnswerSchema,
	trueFalseAnswerSchema
])

export const submitAssessmentAnswersSchema = z.object({
	assessmentId: z.string(),
	answers: z.array(answerSchema)
})

export type SubmitAssessmentAnswers = z.infer<
	typeof submitAssessmentAnswersSchema
>
