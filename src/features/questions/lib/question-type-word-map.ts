import { type QuestionType } from '@prisma/client'

export const questionTypeWordMap: Record<QuestionType, string> = {
	MULTIPLE_CHOICE: 'Multiple Choice',
	MULTIPLE_SELECT: 'Multiple Select',
	TRUE_OR_FALSE: 'True or False'
}
