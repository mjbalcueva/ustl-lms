import { z } from 'zod'

export const aiGeneratedQuestionSchema = z.object({
	question: z.string(),
	options: z.array(z.string()),
	answer: z.union([z.string(), z.array(z.string())]),
	points: z.number()
})

export const aiResponseSchema = z.object({
	questions: z.array(aiGeneratedQuestionSchema)
})
