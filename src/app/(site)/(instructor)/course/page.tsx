import Link from 'next/link'

import { Icons } from '@/client/components/icons'
import { CardStatsMini } from '@/client/components/instructor/course/card-stats-mini'
import { PageBreadcrumbs } from '@/client/components/page-breadcrumbs'
import { PageContent, PageHeader, PageSection, PageTitle, PageWrapper } from '@/client/components/page-wrapper'
import { buttonVariants, Card, CardDescription, CardHeader, CardTitle } from '@/client/components/ui'
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
					<CardStatsMini icon="totalCourse" title="Total Courses" count={0} />
					<CardStatsMini icon="publishedCourse" title="Published Courses" count={0} />
					<CardStatsMini icon="draftCourse" title="Draft Courses" count={0} />
					<CardStatsMini icon="archivedCourse" title="Archived Courses" count={0} />
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
