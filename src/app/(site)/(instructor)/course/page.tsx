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

			<PageContent className="space-y-4">
				<PageSection className="px-0 sm:px-0 md:px-0 lg:px-6">
					<ScrollArea scrollHideDelay={100}>
						<div className="mb-2.5 flex gap-4">
							<CardStatsMini
								icon="totalCourse"
								title="Total Courses"
								count={0}
								className="ml-2 sm:ml-4 md:ml-6 lg:ml-0"
							/>
							<CardStatsMini icon="publishedCourse" title="Published Courses" count={0} />
							<CardStatsMini icon="draftCourse" title="Draft Courses" count={0} />
							<CardStatsMini
								icon="archivedCourse"
								title="Archived Courses"
								count={0}
								className="mr-2 sm:mr-4 md:mr-6 lg:mr-0"
							/>
						</div>
						<ScrollBar orientation="horizontal" className="mx-2 sm:mx-4 md:mx-6 lg:mx-0" />
					</ScrollArea>
				</PageSection>

				<PageSection className="!mt-1.5">
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
