import { z } from 'zod'

export const editShuffleQuestionsSchema = z.object({
	chapterId: z.string(),
	assessmentId: z.string(),
	shuffleQuestions: z.boolean()
})

export type EditShuffleQuestionsSchema = z.infer<typeof editShuffleQuestionsSchema>

export const editShuffleOptionsSchema = z.object({
	chapterId: z.string(),
	assessmentId: z.string(),
	shuffleOptions: z.boolean()
})

export type EditShuffleOptionsSchema = z.infer<typeof editShuffleOptionsSchema>
