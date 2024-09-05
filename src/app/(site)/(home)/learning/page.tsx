import { PageContent, PageDescription, PageHeader, PageTitle, PageWrapper } from '@/client/components/page-wrapper'

export default async function Page() {
	return (
		<PageWrapper>
			<PageHeader>
				<PageTitle>Learning</PageTitle>
				<PageDescription>Learn something new</PageDescription>
			</PageHeader>
			<PageContent></PageContent>
		</PageWrapper>
	)
}