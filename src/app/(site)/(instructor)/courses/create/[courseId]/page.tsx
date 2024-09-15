import { api, HydrateClient } from '@/shared/trpc/server'

import { Breadcrumbs, type Crumb } from '@/client/components/page-breadcrumbs'
import { PageContent, PageDescription, PageHeader, PageTitle, PageWrapper } from '@/client/components/page-wrapper'

export default async function Page({ params }: { params: { courseId: string } }) {
	const { course } = await api.course.getCourse({ courseId: params.courseId })

	const requiredFields = [
		course?.code,
		course?.title,
		course?.description,
		course?.image,
		course?.categoryId,
		course?.isPublished
	]

	const totalFields = requiredFields.length
	const completedFields = requiredFields.filter(Boolean).length
	const completionText = `(${completedFields}/${totalFields})`

	const crumbs: Crumb[] = [
		{ icon: 'instructor', label: 'Instructor' },
		{ icon: 'course', label: 'Courses', href: '/courses' },
		{ label: 'Create', href: '/courses/create' },
		{ label: course?.title ?? '' }
	]

	return (
		<HydrateClient>
			<PageWrapper>
				<PageHeader>
					<div className="flex w-fit flex-col gap-2 sm:flex-row sm:items-end">
						<PageTitle className="font-bold">Course Setup</PageTitle>
						<PageDescription>Completed {completionText}</PageDescription>
					</div>
					<Breadcrumbs crumbs={crumbs} />
				</PageHeader>
				<PageContent></PageContent>
			</PageWrapper>
		</HydrateClient>
	)
}
