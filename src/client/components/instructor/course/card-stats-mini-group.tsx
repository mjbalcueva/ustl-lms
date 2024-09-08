'use client'

import { CardStatsMini } from '@/client/components/instructor/course/card-stats-mini'
import { ScrollArea, ScrollBar } from '@/client/components/ui'
import { useDeviceType } from '@/client/context/device-type-provider'

const CardStatsMiniGroup = () => {
	const { deviceSize } = useDeviceType()

	const isMobile = deviceSize === 'mobile'

	return (
		<ScrollArea scrollHideDelay={!isMobile ? 0 : 600} type="hover">
			<div className="mb-2.5 flex gap-4">
				<CardStatsMini icon="totalCourse" title="Total Courses" count={0} className="ml-2 sm:ml-4 md:ml-6 lg:ml-0" />
				<CardStatsMini icon="publishedCourse" title="Published Courses" count={0} />
				<CardStatsMini icon="draftCourse" title="Draft Courses" count={0} />
				<CardStatsMini
					icon="archivedCourse"
					title="Archived Courses"
					count={0}
					className="mr-2 sm:mr-4 md:mr-6 lg:mr-0"
				/>
			</div>
			<ScrollBar orientation="horizontal" className="mx-2 sm:mx-4 md:mx-6 lg:mx-0" />
		</ScrollArea>
	)
}

export { CardStatsMiniGroup }
