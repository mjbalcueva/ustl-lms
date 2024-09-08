import Link from 'next/link'

import { Icons } from '@/client/components/icons'
import { PageBreadcrumbs } from '@/client/components/page-breadcrumbs'
import { PageContent, PageHeader, PageSection, PageTitle, PageWrapper } from '@/client/components/page-wrapper'
import { buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

export default function Page() {
	return (
		<PageWrapper>
			<PageHeader className="flex items-end justify-between space-y-0">
				<div className="space-y-1.5">
					<PageTitle className="font-bold">Courses</PageTitle>
					<PageBreadcrumbs withIcons />
				</div>
				<Link href="/course/create" className={cn(buttonVariants(), 'h-10 w-32')}>
					<Icons.plusCircle className="mr-1 size-5 shrink-0" />
					New Course
				</Link>
			</PageHeader>

			<PageContent>
				<PageSection className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="flex-row justify-between pb-2">
							<CardDescription>Total Courses</CardDescription>
							<Icons.totalCourse className="size-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<CardTitle className="text-4xl">0</CardTitle>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex-row justify-between pb-2">
							<CardDescription>Published Courses</CardDescription>
							<Icons.publishedCourse className="size-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<CardTitle className="text-4xl">0</CardTitle>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex-row justify-between pb-2">
							<CardDescription>Draft Courses</CardDescription>
							<Icons.draftCourse className="size-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<CardTitle className="text-4xl">0</CardTitle>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex-row justify-between pb-2">
							<CardDescription>Archived Courses</CardDescription>
							<Icons.archivedCourse className="size-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<CardTitle className="text-4xl">0</CardTitle>
						</CardContent>
					</Card>
				</PageSection>

				<PageSection>
					<Card>
						<CardHeader>
							<CardTitle className="font-medium">Course Statistics</CardTitle>
							<CardDescription>You have [n] courses in total ([n] active).</CardDescription>
						</CardHeader>
					</Card>
				</PageSection>
			</PageContent>
		</PageWrapper>
	)
}
