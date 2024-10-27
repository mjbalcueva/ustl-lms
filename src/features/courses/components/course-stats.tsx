'use client'

import { useMemo } from 'react'
import { type Course } from '@prisma/client'

import { ScrollArea, ScrollBar } from '@/core/components/ui/scroll-area'
import { Archive, CourseSingle, Draft, Publish } from '@/core/lib/icons'

import { CourseStatsItem } from '@/features/courses/components/course-stats-item'

type CourseStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'

export const CourseStats = ({ data }: { data: Course[] }) => {
	const courseStats = useMemo(() => {
		const stats = {
			total: data.length,
			published: 0,
			draft: 0,
			archived: 0
		}

		data.forEach((course) => {
			const status = course.status.toLowerCase() as Lowercase<CourseStatus>
			if (status in stats) {
				stats[status as keyof typeof stats]++
			}
		})

		return stats
	}, [data])

	const statsConfig = [
		{
			icon: CourseSingle,
			title: 'Total Courses',
			count: courseStats.total,
			className: 'ml-2 sm:ml-4 md:ml-6 lg:ml-0'
		},
		{
			icon: Publish,
			title: 'Published Courses',
			count: courseStats.published
		},
		{
			icon: Draft,
			title: 'Draft Courses',
			count: courseStats.draft
		},
		{
			icon: Archive,
			title: 'Archived Courses',
			count: courseStats.archived,
			className: 'mr-2 sm:mr-4 md:mr-6 lg:mr-0'
		}
	]

	return (
		<ScrollArea scrollHideDelay={600} type="hover">
			<div className="flex gap-4">
				{statsConfig.map((stat) => (
					<CourseStatsItem key={stat.title} {...stat} />
				))}
			</div>
			<ScrollBar orientation="horizontal" className="mx-2 sm:mx-4 md:mx-6 lg:mx-0" />
		</ScrollArea>
	)
}
