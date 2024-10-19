import { type Breadcrumb } from '@/shared/types/breadcrumbs'

import { CourseStatsGroupSkeleton } from '@/client/components/skeleton/course-stats-group-skeleton'
import {
	PageBreadcrumbs,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle
} from '@/client/components/ui/page'
import { Separator } from '@/client/components/ui/separator'
import { Skeleton } from '@/client/components/ui/skeleton'

export default function Loading() {
	const crumbs: Breadcrumb = [
		{ icon: 'instructor' },
		{ label: 'Courses', href: '/courses' },
		{ label: 'Manage', href: '/courses/manage' }
	]
	return (
		<>
			<PageHeader className="hidden space-y-0 md:flex md:py-3">
				<PageBreadcrumbs crumbs={crumbs} />
			</PageHeader>

			<Separator className="hidden md:block" />

			<PageHeader className="flex flex-wrap items-end justify-between gap-4 space-y-0">
				<div>
					<PageTitle className="font-bold">Manage Your Courses</PageTitle>
					<PageDescription>View insights, manage your courses, and more.</PageDescription>
				</div>
				<Skeleton className="h-10 w-32" />
			</PageHeader>

			<PageContent className="space-y-6">
				<PageSection className="px-0 sm:px-0 md:px-0 lg:px-6">
					<CourseStatsGroupSkeleton />
				</PageSection>

				<PageSection className="!mt-3">
					<Skeleton className="h-36 w-full rounded-xl" />
				</PageSection>

				<PageSection>
					<div className="w-full space-y-4">
						<div className="flex w-full justify-between gap-4">
							<div className="flex gap-4">
								<Skeleton className="h-9 w-72" />
								<Skeleton className="h-9 w-24" />
							</div>
							<Skeleton className="h-9 w-24" />
						</div>
						<Skeleton className="h-32 w-full" />
						<div className="flex justify-end gap-4">
							<Skeleton className="h-9 w-32" />
							<Skeleton className="h-9 w-20" />
							<Skeleton className="h-9 w-64" />
						</div>
					</div>
				</PageSection>
			</PageContent>
		</>
	)
}
