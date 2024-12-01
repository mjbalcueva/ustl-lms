import { type AssessmentQuestionType } from '@prisma/client'

export const questionTypeWordMap: Record<AssessmentQuestionType, string> = {
	MULTIPLE_CHOICE: 'Multiple Choice',
	MULTIPLE_SELECT: 'Multiple Select',
	TRUE_OR_FALSE: 'True or False'
}
