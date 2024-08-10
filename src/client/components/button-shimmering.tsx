import { Button } from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

type ButtonShimmeringProps = React.ComponentProps<typeof Button> & {
	shimmerClassName?: string
}

export const ButtonShimmering = ({ children, className, shimmerClassName, ...props }: ButtonShimmeringProps) => {
	return (
		<Button
			className={cn(
				'group/button relative overflow-hidden hover:transition-all hover:duration-300 hover:ease-in-out',
				className
			)}
			{...props}
		>
			{children}
			<div className="absolute inset-0 flex justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
				<div className={cn('relative w-8 bg-white/[0.05]', shimmerClassName)} />
			</div>
		</Button>
	)
}
