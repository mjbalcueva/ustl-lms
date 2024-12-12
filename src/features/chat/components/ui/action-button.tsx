import { Button, type ButtonProps } from '@/core/components/ui/button'
import { cn } from '@/core/lib/utils/cn'

export const ActionButton = ({
	children,
	className,
	...props
}: ButtonProps) => {
	return (
		<Button
			variant="ghost"
			size="icon"
			className={cn('size-9 rounded-lg hover:text-primary', className)}
			{...props}
		>
			{children}
		</Button>
	)
}
