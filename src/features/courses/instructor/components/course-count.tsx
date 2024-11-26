'use client'

import { type RouterOutputs } from '@/services/trpc/react'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import { ScrollArea, ScrollBar } from '@/core/components/ui/scroll-area'
import { Archive, CourseSingle, Draft, Publish } from '@/core/lib/icons'

export const CourseCount = ({
	count
}: {
	count: RouterOutputs['instructor']['course']['findManyCourses']['count']
}) => {
	const statsConfig = [
		{
			icon: CourseSingle,
			title: 'Total Courses',
			count: count.total,
			className: 'ml-2.5 sm:ml-4 md:ml-6 lg:ml-0'
		},
		{
			icon: Publish,
			title: 'Published Courses',
			count: count.published
		},
		{
			icon: Draft,
			title: 'Draft Courses',
			count: count.draft
		},
		{
			icon: Archive,
			title: 'Archived Courses',
			count: count.archived,
			className: 'mr-2.5 sm:mr-4 md:mr-6 lg:mr-0'
		}
	]

	return (
		<ScrollArea scrollHideDelay={600} type="hover">
			<div className="flex gap-4">
				{statsConfig.map((stat) => (
					<Card
						key={stat.title}
						className="!mb-2.5 w-full !min-w-52 overflow-hidden"
					>
						<CardHeader className="flex-row justify-between pb-2">
							<CardDescription>{stat.title}</CardDescription>
							<stat.icon className="size-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<CardTitle className="text-3xl">{stat.count}</CardTitle>
						</CardContent>
					</Card>
				))}
			</div>
			<ScrollBar
				orientation="horizontal"
				className="mx-2 sm:mx-4 md:mx-6 lg:mx-0"
			/>
		</ScrollArea>
	)
}
