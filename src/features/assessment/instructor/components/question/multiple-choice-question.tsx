import { RadioGroup, RadioGroupItem } from '@/core/components/ui/radio-group'

import { type MultipleChoiceQuestionType } from '@/features/assessment/shared/libs/question-type'

export const MultipleChoiceQuestion = ({
	options,
	answer
}: MultipleChoiceQuestionType) => {
	return (
		<div className="space-y-2">
			{options.map((option, i) => (
				<div key={i} className="flex items-center gap-2">
					<RadioGroup value={answer}>
						<RadioGroupItem value={option} className="hover:cursor-default" />
					</RadioGroup>
					<span className={`text-sm ${option === answer && 'font-medium'}`}>
						{option}
					</span>
				</div>
			))}
		</div>
	)
}
