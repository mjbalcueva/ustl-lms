'use client'

import * as React from 'react'
import { type ControllerRenderProps } from 'react-hook-form'

import { type RouterOutputs } from '@/services/trpc/react'

import {
	type MultipleChoiceQuestionType,
	type MultipleSelectQuestionType,
	type TrueFalseQuestionType
} from '@/features/assessment/shared/libs/question-type'
import { type SubmitAssessmentAnswers } from '@/features/assessment/shared/validations/student-answer-schema'
import { MultipleChoiceQuestion } from '@/features/chapters/student/components/assessment/question/multiple-choice-question'
import { MultipleSelectQuestion } from '@/features/chapters/student/components/assessment/question/multiple-select-question'
import { TrueFalseQuestion } from '@/features/chapters/student/components/assessment/question/true-false-question'

interface QuestionProps {
	question: RouterOutputs['instructor']['assessment']['findOneAssessment']['assessment']['questions'][number]
	index: number
	isSubmitting: boolean
	field: ControllerRenderProps<
		SubmitAssessmentAnswers,
		`answers.${number}.answer`
	>
}

export const DisplayQuestion = ({
	question,
	field,
	isSubmitting,
	index
}: QuestionProps) => {
	return (
		<div className="relative w-full overflow-hidden">
			<div className="flex min-w-0">
				<div className="min-w-0 flex-1 border-l-2 border-muted pl-3">
					{(() => {
						switch (question.questionType) {
							case 'MULTIPLE_CHOICE':
								return (
									<MultipleChoiceQuestion
										{...(question.options as MultipleChoiceQuestionType)}
										field={field}
										questionId={question.questionId}
										isSubmitting={isSubmitting}
										index={index}
									/>
								)
							case 'MULTIPLE_SELECT':
								return (
									<MultipleSelectQuestion
										{...(question.options as MultipleSelectQuestionType)}
										field={field}
										questionId={question.questionId}
										isSubmitting={isSubmitting}
										index={index}
									/>
								)
							case 'TRUE_OR_FALSE':
								return (
									<TrueFalseQuestion
										{...(question.options as TrueFalseQuestionType)}
										field={field}
										questionId={question.questionId}
										isSubmitting={isSubmitting}
										index={index}
									/>
								)
						}
					})()}
				</div>
			</div>
		</div>
	)
}
