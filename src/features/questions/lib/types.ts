export type QuestionOptions =
	| {
			type: 'MULTIPLE_CHOICE'
			options: string[]
			answer: string
	  }
	| {
			type: 'MULTIPLE_SELECT'
			options: string[]
			answer: string[]
	  }
	| {
			type: 'TRUE_OR_FALSE'
			options: ['True', 'False']
			answer: 'True' | 'False'
	  }
