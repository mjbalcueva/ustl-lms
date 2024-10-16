'use client'

import { useMemo } from 'react'
import { type Course } from '@prisma/client'

import { CourseStats } from '@/client/components/course/course-stats'
import { ScrollArea, ScrollBar } from '@/client/components/ui/scroll-area'
import { useDeviceType } from '@/client/context/device-type-provider'

type CourseStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'

export const CourseStatsGroup = ({ courses }: { courses: Course[] }) => {
	const { deviceSize } = useDeviceType()
	const isMobile = deviceSize === 'mobile'

	const courseStats = useMemo(() => {
		const stats = {
			total: courses.length,
			published: 0,
			draft: 0,
			archived: 0
		}

		courses.forEach((course) => {
			const status = course.status.toLowerCase() as Lowercase<CourseStatus>
			if (status in stats) {
				stats[status as keyof typeof stats]++
			}
		})

		return stats
	}, [courses])

	const statsConfig = [
		{
			icon: 'totalCourse',
			title: 'Total Courses',
			count: courseStats.total,
			className: 'ml-2 sm:ml-4 md:ml-6 lg:ml-0'
		},
		{ icon: 'publishedCourse', title: 'Published Courses', count: courseStats.published },
		{ icon: 'draftCourse', title: 'Draft Courses', count: courseStats.draft },
		{
			icon: 'archivedCourse',
			title: 'Archived Courses',
			count: courseStats.archived,
			className: 'mr-2 sm:mr-4 md:mr-6 lg:mr-0'
		}
	] as const

	return (
		<ScrollArea scrollHideDelay={isMobile ? 600 : 0} type="hover">
			<div className="flex gap-4">
				{statsConfig.map((stat) => (
					<CourseStats key={stat.title} {...stat} />
				))}
			</div>
			<ScrollBar orientation="horizontal" className="mx-2 sm:mx-4 md:mx-6 lg:mx-0" />
		</ScrollArea>
	)
}
