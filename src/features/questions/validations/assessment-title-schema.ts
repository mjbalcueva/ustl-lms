import { z } from 'zod'

export const editAssessmentTitleSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required'),
	assessmentId: z.string().min(1, 'Assessment ID is required'),
	title: z.string().min(1, 'Title is required').max(128, 'Title must be less than 128 characters')
})

export type EditAssessmentTitleSchema = z.infer<typeof editAssessmentTitleSchema>
