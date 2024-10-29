import { api } from '@/services/trpc/server'

import {
	PageBreadcrumbs,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle
} from '@/core/components/ui/page'
import { Separator } from '@/core/components/ui/separator'
import { Instructor } from '@/core/lib/icons'
import { type Breadcrumb } from '@/core/types/breadcrumbs'

import { CourseInsights } from '@/features/courses/components/course-insights'
import { CourseStats } from '@/features/courses/components/course-stats'
import { DataTable } from '@/features/courses/components/data-table/data-table'
import { AddCourseForm } from '@/features/courses/components/forms/add-course-form'

export default async function Page() {
	const courses = await api.course.findManyCourses()

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
				<AddCourseForm />
			</PageHeader>

			<PageContent className="space-y-6">
				<PageSection className="px-0 sm:px-0 md:px-0 lg:px-6">
					<CourseStats data={courses} />
				</PageSection>

				<PageSection className="!mt-3">
					<CourseInsights data={courses} />
				</PageSection>

				<PageSection>
					<DataTable data={courses} />
				</PageSection>
			</PageContent>
		</>
	)
}
