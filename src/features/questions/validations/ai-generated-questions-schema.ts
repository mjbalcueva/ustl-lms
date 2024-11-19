import { z } from 'zod'

export const aiGeneratedQuestionSchema = z.object({
	question: z.string(),
	options: z.array(z.string()),
	answer: z.union([z.string(), z.array(z.string())]),
	points: z.number()
})

export type AiGeneratedQuestion = z.infer<typeof aiGeneratedQuestionSchema>

export const aiResponseSchema = z.object({
	questions: z.array(aiGeneratedQuestionSchema)
})

export type AiResponse = z.infer<typeof aiResponseSchema>
