import { Disclosure } from '@/core/components/ui/disclosure'

type AssessmentCardProps = React.ComponentProps<typeof Disclosure> & {
	className?: string
}

export const AssessmentCard = ({
	children,
	defaultOpen = true,
	...props
}: AssessmentCardProps) => {
	return (
		<Disclosure
			defaultOpen={defaultOpen}
			className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm"
			{...props}
		>
			{children}
		</Disclosure>
	)
}
