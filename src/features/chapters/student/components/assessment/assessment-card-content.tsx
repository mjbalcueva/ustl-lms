import { DisclosureContent } from '@/core/components/ui/disclosure'
import { cn } from '@/core/lib/utils/cn'

type AssessmentCardContentProps = React.ComponentProps<
	typeof DisclosureContent
> & {
	className?: string
}

export const AssessmentCardContent = ({
	children,
	className
}: AssessmentCardContentProps) => {
	return (
		<DisclosureContent
			className={cn('space-y-4 px-6 [&>*:last-child]:!mb-6', className)}
		>
			{children}
		</DisclosureContent>
	)
}
