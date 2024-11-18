import { Checkbox } from '@/core/components/ui/checkbox'

type MultipleSelectProps = {
	options: string[]
	answer: string[]
}

export const MultipleSelectQuestion = ({ options, answer }: MultipleSelectProps) => {
	return (
		<div className="space-y-2">
			{options.map((option, i) => {
				const isCorrect = answer.includes(option)
				return (
					<div key={i} className="flex items-center gap-2">
						<Checkbox checked={isCorrect} className="hover:cursor-default" />
						<span className={`text-sm ${isCorrect && 'font-medium'}`}>{option}</span>
					</div>
				)
			})}
		</div>
	)
}
