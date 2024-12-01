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
import { Home } from '@/core/lib/icons'
import { type Breadcrumb } from '@/core/types/breadcrumbs'

import { EnrolledCourses } from '@/features/courses/student/components/enrolled-courses'
import { EnrollToCourseButton } from '@/features/enrollments/student/components/enroll-to-course-button'

export default async function Page() {
	const { courses } = await api.student.course.findManyEnrolledCourses()

	const crumbs: Breadcrumb = [
		{ icon: Home },
		{ label: 'Browse', href: '/courses' }
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
					<PageDescription>
						Find a course to learn something new
					</PageDescription>
				</div>
				<EnrollToCourseButton />
			</PageHeader>

			<PageContent className="mb-12 md:mb-24">
				<PageSection className="space-y-4">
					<EnrolledCourses courses={courses} />
				</PageSection>
			</PageContent>
		</>
	)
}
