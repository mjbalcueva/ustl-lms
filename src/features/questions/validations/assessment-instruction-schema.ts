import { z } from 'zod'

export const editAssessmentInstructionSchema = z.object({
	chapterId: z.string().min(1, 'Chapter ID is required'),
	assessmentId: z.string().min(1, 'Assessment ID is required'),
	instruction: z.string().max(1024, 'Instruction must be less than 1024 characters').nullable()
})

export type EditAssessmentInstructionSchema = z.infer<typeof editAssessmentInstructionSchema>
