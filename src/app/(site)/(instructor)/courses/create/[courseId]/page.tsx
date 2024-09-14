import { api, HydrateClient } from '@/shared/trpc/server'

import { PageContent, PageWrapper } from '@/client/components/page-wrapper'

export default async function Page({ params }: { params: { courseId: string } }) {
	const getCourse = await api.course.getCourse({ courseId: params.courseId })

	return (
		<HydrateClient>
			<PageWrapper>
				<PageContent>
					<pre>{JSON.stringify(getCourse, null, 2)}</pre>
				</PageContent>
			</PageWrapper>
		</HydrateClient>
	)
}
