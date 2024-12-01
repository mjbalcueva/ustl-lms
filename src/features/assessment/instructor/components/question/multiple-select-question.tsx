import { Checkbox } from '@/core/components/ui/checkbox'

import { type MultipleSelectQuestionType } from '@/features/assessment/shared/libs/question-type'

export const MultipleSelectQuestion = ({
	options,
	answer
}: MultipleSelectQuestionType) => {
	return (
		<div className="space-y-2">
			{options.map((option, i) => {
				const isCorrect = answer.includes(option)
				return (
					<div key={i} className="flex items-center gap-2">
						<Checkbox checked={isCorrect} className="hover:cursor-default" />
						<span className={`text-sm ${isCorrect && 'font-medium'}`}>
							{option}
						</span>
					</div>
				)
			})}
		</div>
	)
}
