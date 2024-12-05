'use client'

import * as React from 'react'
import { type ControllerRenderProps } from 'react-hook-form'

import { Label } from '@/core/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/core/components/ui/radio-group'

import { type SubmitAssessmentAnswers } from '@/features/assessment/shared/validations/student-answer-schema'

interface TrueFalseQuestionProps {
	field: ControllerRenderProps<
		SubmitAssessmentAnswers,
		`answers.${number}.answer`
	>
	questionId: string
	isSubmitting: boolean
	index: number
}

export const TrueFalseQuestion = ({
	field,
	questionId,
	isSubmitting
}: TrueFalseQuestionProps) => {
	const options = ['True', 'False'] as const

	return (
		<RadioGroup
			value={field.value as string}
			onValueChange={(value) => field.onChange(value)}
			className="space-y-2"
		>
			{options.map((option, optionIndex) => (
				<div key={optionIndex} className="flex items-center space-x-2">
					<RadioGroupItem
						value={option}
						id={`${questionId}-${optionIndex}`}
						disabled={isSubmitting}
					/>
					<Label htmlFor={`${questionId}-${optionIndex}`}>{option}</Label>
				</div>
			))}
		</RadioGroup>
	)
}
