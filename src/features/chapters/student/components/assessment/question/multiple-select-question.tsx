'use client'

import * as React from 'react'
import { type ControllerRenderProps } from 'react-hook-form'

import { Checkbox } from '@/core/components/ui/checkbox'
import { Label } from '@/core/components/ui/label'

import { type SubmitAssessmentAnswers } from '@/features/assessment/shared/validations/student-answer-schema'

interface MultipleSelectQuestionProps {
	options: string[]
	field: ControllerRenderProps<
		SubmitAssessmentAnswers,
		`answers.${number}.answer`
	>
	questionId: string
	isSubmitting: boolean
	index: number
}

export const MultipleSelectQuestion = ({
	options,
	field,
	questionId,
	isSubmitting
}: MultipleSelectQuestionProps) => {
	const selectedValues = (field.value as string[]) || []

	const onCheckedChange = (checked: boolean, option: string) => {
		const newValues = checked
			? [...selectedValues, option]
			: selectedValues.filter((value) => value !== option)
		field.onChange(newValues)
	}

	return (
		<div className="space-y-2">
			{options.map((option, optionIndex) => (
				<div key={optionIndex} className="flex items-center space-x-2">
					<Checkbox
						id={`${questionId}-${optionIndex}`}
						checked={selectedValues.includes(option)}
						onCheckedChange={(checked) =>
							onCheckedChange(checked as boolean, option)
						}
						value={option}
						disabled={isSubmitting}
					/>
					<Label htmlFor={`${questionId}-${optionIndex}`}>{option}</Label>
				</div>
			))}
		</div>
	)
}
