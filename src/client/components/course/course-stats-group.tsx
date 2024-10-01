'use client'

import { api } from '@/shared/trpc/react'

import { CourseStats } from '@/client/components/course/course-stats'
import { CourseStatsGroupSkeleton } from '@/client/components/skeleton/course-stats-group-skeleton'
import { ScrollArea, ScrollBar } from '@/client/components/ui'
import { useDeviceType } from '@/client/context/device-type-provider'

export const CourseStatsGroup = () => {
	const { deviceSize } = useDeviceType()

	const isMobile = deviceSize === 'mobile'

	const { data } = api.instructor.getCourseStats.useQuery()
	if (!data) return <CourseStatsGroupSkeleton />

	const { totalCourses, publishedCourses, drafts } = data

	return (
		<ScrollArea scrollHideDelay={!isMobile ? 0 : 600} type="hover">
			<div className="flex gap-4">
				<CourseStats
					icon="totalCourse"
					title="Total Courses"
					count={totalCourses}
					className="ml-2 sm:ml-4 md:ml-6 lg:ml-0"
				/>
				<CourseStats icon="publishedCourse" title="Published Courses" count={publishedCourses} />
				<CourseStats icon="draftCourse" title="Draft Courses" count={drafts} />
				<CourseStats
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
