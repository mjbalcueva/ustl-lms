import { api, HydrateClient } from '@/shared/trpc/server'

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
	const completionText = `(${completedFields} / ${totalFields})`

	return (
		<HydrateClient>
			<PageWrapper>
				<PageHeader className="flex flex-wrap items-end justify-between gap-4 space-y-0">
					<div className="space-y-1.5">
						<div className="flex items-end justify-between space-x-2">
							<PageTitle className="font-bold">Course Setup</PageTitle>
							<PageDescription>{completionText}</PageDescription>
						</div>
						{/* <PageBreadcrumbs /> */}
					</div>
				</PageHeader>
				<PageContent>
					<pre>{JSON.stringify(course, null, 2)}</pre>
				</PageContent>
			</PageWrapper>
		</HydrateClient>
	)
}
