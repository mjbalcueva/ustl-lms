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
						<Checkbox
							disabled
							checked={isCorrect}
							className={isCorrect ? 'border-green-500' : ''}
						/>
						<span
							className={`text-sm ${
								isCorrect ? 'font-medium text-green-500' : 'text-muted-foreground'
							}`}
						>
							{option}
						</span>
					</div>
				)
			})}
		</div>
	)
}
