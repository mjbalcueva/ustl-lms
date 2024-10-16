'use client'

import { ScrollArea, ScrollBar } from '@/client/components/ui/scroll-area'
import { Skeleton } from '@/client/components/ui/skeleton'
import { useDeviceType } from '@/client/context/device-type-provider'

export const CourseStatsGroupSkeleton = () => {
	const { deviceSize } = useDeviceType()

	const isMobile = deviceSize === 'mobile'

	return (
		<ScrollArea scrollHideDelay={!isMobile ? 0 : 600} type="hover">
			<div className="mb-4 flex gap-4">
				<Skeleton className="h-24 w-full !min-w-52" />
				<Skeleton className="h-24 w-full !min-w-52" />
				<Skeleton className="h-24 w-full !min-w-52" />
				<Skeleton className="h-24 w-full !min-w-52" />
			</div>
			<ScrollBar orientation="horizontal" className="mx-2 sm:mx-4 md:mx-6 lg:mx-0" />
		</ScrollArea>
	)
}
