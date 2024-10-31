import {
	PageBreadcrumbs,
	PageContent,
	PageDescription,
	PageHeader,
	PageTitle
} from '@/core/components/ui/page'
import { Separator } from '@/core/components/ui/separator'
import { Home } from '@/core/lib/icons'
import { type Breadcrumb } from '@/core/types/breadcrumbs'

import { EnrollToCourseButton } from '@/features/enrollment/components/enroll-to-course-button'

export default async function Page() {
	const crumbs: Breadcrumb = [
		{ icon: Home },
		{ label: 'Learning', href: '/courses' },
		{ label: 'Browse' }
	]
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
				<EnrollToCourseButton />
			</PageHeader>

			<PageContent></PageContent>
		</>
	)
}
