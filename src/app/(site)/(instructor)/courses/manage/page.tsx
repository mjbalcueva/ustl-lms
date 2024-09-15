import { CardPerformanceInsights } from '@/client/components/instructor/course/card-performance-insights'
import { CardStatsMiniGroup } from '@/client/components/instructor/course/card-stats-mini-group'
import { FilterButton } from '@/client/components/instructor/course/filter-button'
import { NewCourseButton } from '@/client/components/instructor/course/new-course-button'
import { SearchInput } from '@/client/components/instructor/course/search-input'
import { Breadcrumbs, type Crumb } from '@/client/components/page-breadcrumbs'
import {
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle,
	PageWrapper
} from '@/client/components/page-wrapper'
import { Separator } from '@/client/components/ui'

export default function Page() {
	const crumbs: Crumb[] = [
		{ icon: 'instructor', label: 'Instructor' },
		{ icon: 'course', label: 'Courses', href: '/courses' },
		{ label: 'Manage' }
	]

	return (
		<PageWrapper>
			<PageHeader className="hidden space-y-0 md:flex md:py-3">
				<Breadcrumbs crumbs={crumbs} />
			</PageHeader>

			<Separator />

			<PageHeader className="flex flex-wrap items-end justify-between gap-4 space-y-0">
				<div className="space-y-1.5">
					<PageTitle className="font-bold">Manage Your Courses</PageTitle>
					<PageDescription>View insights, manage your courses, and more.</PageDescription>
				</div>
				<NewCourseButton />
			</PageHeader>

			<PageContent className="space-y-6">
				<PageSection className="px-0 sm:px-0 md:px-0 lg:px-6">
					<CardStatsMiniGroup />
				</PageSection>

				<PageSection className="!mt-3">
					<CardPerformanceInsights />
				</PageSection>

				<PageSection>
					<div className="flex items-center gap-4">
						<SearchInput />
						<FilterButton />
					</div>
				</PageSection>
			</PageContent>
		</PageWrapper>
	)
}
