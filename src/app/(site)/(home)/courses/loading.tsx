import { Card, CardContent, CardFooter, CardHeader } from '@/core/components/ui/card'
import {
	PageBreadcrumbs,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle
} from '@/core/components/ui/page'
import { Separator } from '@/core/components/ui/separator'
import { Skeleton } from '@/core/components/ui/skeleton'
import { Home } from '@/core/lib/icons'
import { type Breadcrumb } from '@/core/types/breadcrumbs'

export default function Loading() {
	const crumbs: Breadcrumb = [{ icon: Home }, { label: 'Browse', href: '/courses' }]

	return (
		<>
			<PageHeader className="hidden space-y-0 md:block md:py-3">
				<PageBreadcrumbs crumbs={crumbs} />
			</PageHeader>

			<Separator className="hidden md:block" />

			<PageHeader className="flex flex-wrap items-end justify-between gap-4 space-y-0">
				<div>
					<PageTitle className="font-bold">Browse Courses</PageTitle>
					<PageDescription>Find a course to learn something new</PageDescription>
				</div>
				<Skeleton className="h-10 w-28" />
			</PageHeader>

			<PageContent>
				<PageSection className="space-y-4">
					<div className="flex flex-wrap gap-2">
						<Skeleton className="h-10 w-96" />
						<Skeleton className="h-10 w-24" />
						<Skeleton className="h-10 w-32" />
					</div>

					<div className="flex flex-wrap gap-4">
						{Array.from({ length: 5 }).map((_, i) => (
							<Card
								key={`skeleton-${i}`}
								className="flex w-full min-w-[260px] max-w-[280px] flex-1 flex-col overflow-hidden"
							>
								<CardHeader className="relative p-0">
									<Skeleton className="h-36 w-full rounded-b-none" />
									<Skeleton className="absolute left-2 top-2 h-5 w-16" />
								</CardHeader>
								<CardContent className="grid flex-grow gap-3 p-3">
									<div className="space-y-1">
										<Skeleton className="h-4 w-2/3" />
										<Skeleton className="h-3 w-full" />
										<Skeleton className="h-3 w-full" />
										<Skeleton className="h-3 w-3/4" />
									</div>
									<div className="flex items-center gap-1">
										<Skeleton className="h-3 w-3" />
										<Skeleton className="h-3 w-1/3" />
									</div>
									<div className="flex gap-1">
										<Skeleton className="h-3 w-10" />
										<Skeleton className="h-3 w-10" />
										<Skeleton className="h-3 w-10" />
									</div>
								</CardContent>
								<CardFooter className="p-3 pt-0">
									<Skeleton className="h-8 w-full" />
								</CardFooter>
							</Card>
						))}
					</div>
				</PageSection>
			</PageContent>
		</>
	)
}
