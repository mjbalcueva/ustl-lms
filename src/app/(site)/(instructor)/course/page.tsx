import Link from 'next/link'

import { Icons } from '@/client/components/icons'
import { CardStatsMini } from '@/client/components/instructor/course/card-stats-mini'
import { PageBreadcrumbs } from '@/client/components/page-breadcrumbs'
import { PageContent, PageHeader, PageSection, PageTitle, PageWrapper } from '@/client/components/page-wrapper'
import {
	buttonVariants,
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	ScrollArea,
	ScrollBar
} from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

export default function Page() {
	return (
		<PageWrapper>
			<PageHeader className="flex flex-wrap items-end justify-between gap-4 space-y-0">
				<div className="space-y-1.5">
					<PageTitle className="font-bold">Manage Your Courses</PageTitle>
					<PageBreadcrumbs withIcons />
				</div>
				<Link href="/course/create" className={cn(buttonVariants(), 'h-10 w-32')}>
					<Icons.plusCircle className="mr-1 size-5 shrink-0" />
					New Course
				</Link>
			</PageHeader>

			<PageContent>
				<PageSection asChild>
					<ScrollArea>
						<div className="flex gap-4 rounded-lg">
							<CardStatsMini icon="totalCourse" title="Total Courses" count={0} />
							<CardStatsMini icon="publishedCourse" title="Published Courses" count={0} />
							<CardStatsMini icon="draftCourse" title="Draft Courses" count={0} />
							<CardStatsMini icon="archivedCourse" title="Archived Courses" count={0} />
						</div>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
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
