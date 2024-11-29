export type MultipleChoiceQuestionType = {
	options: string[]
	answer: string
}

export type MultipleSelectQuestionType = {
	options: string[]
	answer: string[]
}

export type TrueFalseQuestionType = {
	options: ['True', 'False']
	answer: 'True' | 'False'
}
