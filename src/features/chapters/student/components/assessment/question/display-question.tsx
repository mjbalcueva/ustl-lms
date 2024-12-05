'use client'

import * as React from 'react'

import { type RouterOutputs } from '@/services/trpc/react'

import {
	type MultipleChoiceQuestionType,
	type MultipleSelectQuestionType,
	type TrueFalseQuestionType
} from '@/features/assessment/shared/libs/question-type'
import { MultipleChoiceQuestion } from '@/features/chapters/student/components/assessment/question/multiple-choice-question'
import { MultipleSelectQuestion } from '@/features/chapters/student/components/assessment/question/multiple-select-question'
import { TrueFalseQuestion } from '@/features/chapters/student/components/assessment/question/true-false-question'

export const DisplayQuestion = ({
	question
}: {
	question: RouterOutputs['instructor']['assessment']['findOneAssessment']['assessment']['questions'][number]
}) => {
	return (
		<div className="flex items-center gap-2 pl-2">
			<div className="flex-1 border-l-2 border-muted pl-3">
				{(() => {
					switch (question.questionType) {
						case 'MULTIPLE_CHOICE':
							return (
								<MultipleChoiceQuestion
									{...(question.options as MultipleChoiceQuestionType)}
								/>
							)
						case 'MULTIPLE_SELECT':
							return (
								<MultipleSelectQuestion
									{...(question.options as MultipleSelectQuestionType)}
								/>
							)
						case 'TRUE_OR_FALSE':
							return (
								<TrueFalseQuestion
									{...(question.options as TrueFalseQuestionType)}
								/>
							)
					}
				})()}
			</div>
		</div>
	)
}
