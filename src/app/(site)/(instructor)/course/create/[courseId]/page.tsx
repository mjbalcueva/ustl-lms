import { PageContent, PageWrapper } from '@/client/components/page-wrapper'

export default function Page({ params }: { params: { courseId: string } }) {
	return (
		<PageWrapper>
			<PageContent>
				rawr
				<pre>{JSON.stringify(params.courseId, null, 2)}</pre>
			</PageContent>
		</PageWrapper>
	)
}
