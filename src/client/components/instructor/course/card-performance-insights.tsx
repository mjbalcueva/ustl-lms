import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/client/components/ui'

const CardPerformanceInsights = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="font-medium">Performance Insights</CardTitle>
				<CardDescription>Overview of your course portfolio.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<div className="flex flex-col">
						<span className="text-3xl font-bold">0</span>
						<span className="text-sm text-muted-foreground">Enrolled Students</span>
					</div>
					<div className="flex flex-col">
						<span className="text-3xl font-bold">0</span>
						<span className="text-sm text-muted-foreground">Created Lessons</span>
					</div>
					<div className="flex flex-col">
						<span className="text-3xl font-bold">0</span>
						<span className="text-sm text-muted-foreground">Average Rating</span>
					</div>
					<div className="flex flex-col">
						<span className="text-3xl font-bold">0%</span>
						<span className="text-sm text-muted-foreground">Avg. Completion Rate</span>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export { CardPerformanceInsights }
