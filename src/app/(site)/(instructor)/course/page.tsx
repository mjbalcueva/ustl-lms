import Link from 'next/link'

import { Icons } from '@/client/components/icons'
import { CardPerformanceInsights } from '@/client/components/instructor/course/card-performance-insights'
import { CardStatsMiniGroup } from '@/client/components/instructor/course/card-stats-mini-group'
import { PageBreadcrumbs } from '@/client/components/page-breadcrumbs'
import { PageContent, PageHeader, PageSection, PageTitle, PageWrapper } from '@/client/components/page-wrapper'
import { buttonVariants, Input } from '@/client/components/ui'
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
					<CardStatsMiniGroup />
				</PageSection>

				<PageSection className="!mt-1.5">
					<CardPerformanceInsights />
				</PageSection>

				<PageSection>
					<div className="relative max-w-xs flex-grow rounded-lg">
						<Icons.search className="absolute left-2 size-4 translate-y-2/3 text-muted-foreground" />
						<Input placeholder="Search courses" className="bg-card pl-8" />
					</div>
				</PageSection>
			</PageContent>
		</PageWrapper>
	)
}
