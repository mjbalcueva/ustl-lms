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

import { CourseCount } from '@/features/courses/instructor/components/course-count'
import { CourseStats } from '@/features/courses/instructor/components/course-stats'
import { AddCourseForm } from '@/features/courses/instructor/components/forms/add-course-form'

export default async function Page() {
	const data = await api.instructor.course.findManyCourses()

	const crumbs: Breadcrumb = [
		{ icon: Instructor },
		{ label: 'Courses', href: '/instructor/courses/' }
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
					<PageDescription>
						View insights, manage your courses, and more.
					</PageDescription>
				</div>
				<AddCourseForm />
			</PageHeader>

			<PageContent className="space-y-6">
				<PageSection className="px-0 sm:px-0 md:px-0 lg:px-6">
					<CourseCount count={data.count} />
				</PageSection>

				<PageSection className="!mt-3">
					<CourseStats stats={data.stats} />
				</PageSection>

				<PageSection>{/* <DataTable data={courses} /> */}</PageSection>
			</PageContent>
		</>
	)
}
