import { Separator, Skeleton } from '@/client/components/ui'

export const NavSkeleton = () => {
	return (
		<div className="sticky top-0 h-14 border-b border-border bg-card/40 backdrop-blur-xl md:h-full md:w-[60px] md:rounded-xl md:border-none md:px-2 md:pb-4 md:pt-0.5">
			<div className="hidden h-full flex-col items-center space-y-5 md:flex">
				<div className="flex w-full items-center justify-center py-1">
					<Skeleton className="size-9 border border-border" />
				</div>
				<Separator className="!mb-1.5 !mt-3" />
				<Skeleton className="size-6 border border-border" />
				<Skeleton className="size-6 border border-border" />
				<Skeleton className="size-6 border border-border" />
				<Skeleton className="size-6 border border-border" />
				<Skeleton className="!mt-auto size-6 border border-border" />
				<Separator className="!mb-0 !mt-5" />
				<div className="!mb-2 flex w-full items-center justify-center">
					<Skeleton className="size-8 rounded-full border border-border" />
				</div>
			</div>
			<div className="flex h-full w-full items-center justify-between px-4 sm:px-5 md:hidden">
				<Skeleton className="size-8 border border-border" />
				<Skeleton className="size-8 border border-border" />
				<Skeleton className="size-8 rounded-full border border-border" />
			</div>
		</div>
	)
}
