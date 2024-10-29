import {
	PageBreadcrumbs,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle
} from '@/core/components/ui/page'
import { ScrollArea, ScrollBar } from '@/core/components/ui/scroll-area'
import { Separator } from '@/core/components/ui/separator'
import { Skeleton } from '@/core/components/ui/skeleton'
import { Instructor } from '@/core/lib/icons'
import { type Breadcrumb } from '@/core/types/breadcrumbs'

export default function Loading() {
	const crumbs: Breadcrumb = [
		{ icon: Instructor },
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
					<ScrollArea scrollHideDelay={600} type="hover">
						<div className="mb-4 flex gap-4">
							<Skeleton className="ml-2.5 h-28 w-full !min-w-52" />
							<Skeleton className="h-28 w-full !min-w-52" />
							<Skeleton className="h-28 w-full !min-w-52" />
							<Skeleton className="mr-2.5 h-28 w-full !min-w-52" />
						</div>
						<ScrollBar orientation="horizontal" className="mx-2 sm:mx-4 md:mx-6 lg:mx-0" />
					</ScrollArea>
				</PageSection>

				<PageSection className="!mt-3">
					<Skeleton className="h-44 w-full rounded-xl" />
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
