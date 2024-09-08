import { CardPerformanceInsights } from '@/client/components/instructor/course/card-performance-insights'
import { CardStatsMiniGroup } from '@/client/components/instructor/course/card-stats-mini-group'
import { NewCourseButton } from '@/client/components/instructor/course/new-course-button'
import { SearchInput } from '@/client/components/instructor/course/search-input'
import { PageBreadcrumbs } from '@/client/components/page-breadcrumbs'
import { PageContent, PageHeader, PageSection, PageTitle, PageWrapper } from '@/client/components/page-wrapper'

export default function Page() {
	return (
		<PageWrapper>
			<PageHeader className="flex flex-wrap items-end justify-between gap-4 space-y-0">
				<div className="space-y-1.5">
					<PageTitle className="font-bold">Manage Your Courses</PageTitle>
					<PageBreadcrumbs withIcons />
				</div>
				<NewCourseButton />
			</PageHeader>

			<PageContent className="space-y-4">
				<PageSection className="px-0 sm:px-0 md:px-0 lg:px-6">
					<CardStatsMiniGroup />
				</PageSection>

				<PageSection className="!mt-1.5">
					<CardPerformanceInsights />
				</PageSection>

				<PageSection>
					<SearchInput />
				</PageSection>
			</PageContent>
		</PageWrapper>
	)
}
