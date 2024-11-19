import { RadioGroup, RadioGroupItem } from '@/core/components/ui/radio-group'

type MultipleChoiceProps = {
	options: string[]
	answer: string
}

export const MultipleChoiceQuestion = ({ options, answer }: MultipleChoiceProps) => {
	return (
		<div className="space-y-2">
			{options.map((option, i) => (
				<div key={i} className="flex items-center gap-2">
					<RadioGroup value={answer}>
						<RadioGroupItem value={option} className="hover:cursor-default" />
					</RadioGroup>
					<span className={`text-sm ${option === answer && 'font-medium'}`}>{option}</span>
				</div>
			))}
		</div>
	)
}
