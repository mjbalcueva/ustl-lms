import { api } from '@/shared/trpc/server'
import { type Breadcrumb } from '@/shared/types/breadcrumbs'

import { CourseInsights } from '@/client/components/course/course-insights'
import { CourseStatsGroup } from '@/client/components/course/course-stats-group'
import { AddCourseForm } from '@/client/components/course/forms/add-course'
import { columns } from '@/client/components/course/manage-column'
import { ManageDataTable } from '@/client/components/course/manage-data-table'
import {
	PageBreadcrumbs,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle,
	PageWrapper,
	Separator
} from '@/client/components/ui'

export default async function Page() {
	const courses = await api.instructor.getCourses()

	if (!courses) return null

	const crumbs: Breadcrumb = [{ icon: 'instructor' }, { label: 'Courses', href: '/courses' }, { label: 'Manage' }]

	return (
		<PageWrapper>
			<PageHeader className="hidden space-y-0 md:flex md:py-3">
				<PageBreadcrumbs crumbs={crumbs} />
			</PageHeader>

			<Separator className="hidden md:block" />

			<PageHeader className="flex flex-wrap items-end justify-between gap-4 space-y-0">
				<div className="space-y-1.5">
					<PageTitle className="font-bold">Manage Your Courses</PageTitle>
					<PageDescription>View insights, manage your courses, and more.</PageDescription>
				</div>
				<AddCourseForm />
			</PageHeader>

			<PageContent className="space-y-6">
				<PageSection className="px-0 sm:px-0 md:px-0 lg:px-6">
					<CourseStatsGroup />
				</PageSection>

				<PageSection className="!mt-3">
					<CourseInsights />
				</PageSection>

				<PageSection>
					<ManageDataTable columns={columns} data={courses} />
				</PageSection>
			</PageContent>
		</PageWrapper>
	)
}
