import { cn } from '@/core/lib/utils/cn'

function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn('animate-pulse rounded-lg bg-muted', className)}
			{...props}
		/>
	)
}

export { Skeleton }
