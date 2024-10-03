import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/client/components/ui'

export const CourseInsights = () => {
	return (
		<Card>
			<CardHeader className="flex-col items-start">
				<CardTitle>Insights</CardTitle>
				<CardDescription>Overview of your course portfolio.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<div className="flex flex-col">
						<CardTitle className="text-3xl">0</CardTitle>
						<CardDescription>Enrolled Students</CardDescription>
					</div>
					<div className="flex flex-col">
						<CardTitle className="text-3xl">0</CardTitle>
						<CardDescription>Created Lessons</CardDescription>
					</div>
					<div className="flex flex-col">
						<CardTitle className="text-3xl">0</CardTitle>
						<CardDescription>Average Rating</CardDescription>
					</div>
					<div className="flex flex-col">
						<CardTitle className="text-3xl">0%</CardTitle>
						<CardDescription>Avg. Completion Rate</CardDescription>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
