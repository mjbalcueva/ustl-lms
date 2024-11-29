import { Skeleton } from '@/core/components/ui/skeleton'

export const CommandSkeleton = () => {
	return (
		<div className="px-1 py-1.5">
			<div className="flex h-8 items-center gap-2 rounded-sm px-2 hover:bg-accent/50">
				<Skeleton className="size-4" />
				<Skeleton className="h-4 w-[80%]" />
			</div>
			<div className="flex h-8 items-center gap-2 rounded-sm px-2 hover:bg-accent/50">
				<Skeleton className="size-4" />
				<Skeleton className="h-4 w-full" />
			</div>
			<div className="flex h-8 items-center gap-2 rounded-sm px-2 hover:bg-accent/50">
				<Skeleton className="size-4" />
				<Skeleton className="h-4 w-[60%]" />
			</div>
		</div>
	)
}
