import { z } from 'zod'

export const findAssessmentSchema = z.object({
	chapterId: z.string(),
	assessmentId: z.string()
})

export type FindAssessmentSchema = z.infer<typeof findAssessmentSchema>

export const findOtherChaptersSchema = z.object({
	courseId: z.string()
})

export type FindOtherChaptersSchema = z.infer<typeof findOtherChaptersSchema>
