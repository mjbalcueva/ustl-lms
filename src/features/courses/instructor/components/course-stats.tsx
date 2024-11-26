import { type RouterOutputs } from '@/services/trpc/react'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'

export const CourseStats = ({
	stats
}: {
	stats: RouterOutputs['instructor']['course']['findManyCourses']['stats']
}) => {
	return (
		<Card>
			<CardHeader className="flex-col items-start">
				<CardTitle>Insights</CardTitle>
				<CardDescription>Overview of your course portfolio.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<div className="flex flex-col">
						<CardTitle className="text-3xl">{stats.students}</CardTitle>
						<CardDescription>Total Students</CardDescription>
					</div>
					<div className="flex flex-col">
						<CardTitle className="text-3xl">{stats.chapters}</CardTitle>
						<CardDescription>Created Chapters</CardDescription>
					</div>
					<div className="flex flex-col">
						<CardTitle className="text-3xl">
							{stats.completionRate.toFixed(1)}
						</CardTitle>
						<CardDescription>Average Student Rating</CardDescription>
					</div>
					<div className="flex flex-col">
						<CardTitle className="text-3xl">
							{Math.round(stats.completionRate)}%
						</CardTitle>
						<CardDescription>Avg. Completion Rate</CardDescription>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
