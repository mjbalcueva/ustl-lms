import { type Chapter, type Course } from '@prisma/client'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'

type CourseWithRelations = Course & {
	chapters: Chapter[]
	_count?: {
		enrollments: number
		chapters: number
	}
}

export const CourseInsights = ({ data }: { data: CourseWithRelations[] }) => {
	const totalStudents = data.reduce((acc, course) => acc + (course._count?.enrollments ?? 0), 0)
	const totalChapters = data.reduce((acc, course) => acc + (course._count?.chapters ?? 0), 0)
	const avgRating = 0
	const avgCompletionRate = 0

	return (
		<Card>
			<CardHeader className="flex-col items-start">
				<CardTitle>Insights</CardTitle>
				<CardDescription>Overview of your course portfolio.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<div className="flex flex-col">
						<CardTitle className="text-3xl">{totalStudents}</CardTitle>
						<CardDescription>Total Students</CardDescription>
					</div>
					<div className="flex flex-col">
						<CardTitle className="text-3xl">{totalChapters}</CardTitle>
						<CardDescription>Created Chapters</CardDescription>
					</div>
					<div className="flex flex-col">
						<CardTitle className="text-3xl">{avgRating.toFixed(1)}</CardTitle>
						<CardDescription>Average Student Rating</CardDescription>
					</div>
					<div className="flex flex-col">
						<CardTitle className="text-3xl">{Math.round(avgCompletionRate)}%</CardTitle>
						<CardDescription>Avg. Completion Rate</CardDescription>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
