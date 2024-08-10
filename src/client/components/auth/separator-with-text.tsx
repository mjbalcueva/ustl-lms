import { Separator } from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

type SeparatorWithTextProps = React.HTMLAttributes<HTMLDivElement> & {
	text: string
}

export const SeparatorWithText = ({ text, className, ...props }: SeparatorWithTextProps) => {
	return (
		<div className={cn('relative w-full', className)} {...props}>
			<Separator />
			<div className="absolute left-0 right-0 flex translate-y-[-50%] items-center justify-center">
				<span className="pointer-events-none select-none bg-card px-2 text-xs leading-none text-muted-foreground">
					{text}
				</span>
			</div>
		</div>
	)
}
