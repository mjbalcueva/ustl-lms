import { RadioGroup, RadioGroupItem } from '@/core/components/ui/radio-group'

type TrueFalseProps = {
	answer: 'True' | 'False'
}

export const TrueFalseQuestion = ({ answer }: TrueFalseProps) => {
	return (
		<div className="space-y-2">
			<RadioGroup value={String(answer).toLowerCase()}>
				{['true', 'false'].map((value) => (
					<div key={value} className="flex items-center gap-2">
						<RadioGroupItem value={value} className="hover:cursor-default" />
						<span className={`text-sm ${value === String(answer).toLowerCase() && 'font-medium'}`}>
							{value.charAt(0).toUpperCase() + value.slice(1)}
						</span>
					</div>
				))}
			</RadioGroup>
		</div>
	)
}
