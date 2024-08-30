import { PageContent, PageDescription, PageHeader, PageTitle, PageWrapper } from '@/client/components/page-wrapper'

export default async function Page() {
	return (
		<PageWrapper>
			<PageHeader>
				<PageTitle>Chat</PageTitle>
				<PageDescription>Chat with your friends</PageDescription>
			</PageHeader>
			<PageContent></PageContent>
		</PageWrapper>
	)
}
