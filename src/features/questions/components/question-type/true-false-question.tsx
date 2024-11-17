import { Label } from '@/core/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/core/components/ui/radio-group'

type TrueFalseProps = {
	answer: 'True' | 'False'
}

export const TrueFalseQuestion = ({ answer }: TrueFalseProps) => {
	return (
		<div className="space-y-2">
			<RadioGroup value={String(answer).toLowerCase()} disabled>
				{['true', 'false'].map((value) => (
					<div key={value} className="flex items-center gap-2">
						<RadioGroupItem
							value={value}
							className={value === String(answer).toLowerCase() ? 'border-green-500' : ''}
						/>
						<Label
							className={`text-sm ${
								value === String(answer).toLowerCase()
									? 'font-medium text-green-500'
									: 'text-muted-foreground'
							}`}
						>
							{value.charAt(0).toUpperCase() + value.slice(1)}
						</Label>
					</div>
				))}
			</RadioGroup>
		</div>
	)
}
