import { PageContent, PageDescription, PageHeader, PageTitle } from '@/client/components/ui/page'

export default async function Page() {
	return (
		<>
			<PageHeader>
				<PageTitle>Chat</PageTitle>
				<PageDescription>Chat with your friends</PageDescription>
			</PageHeader>
			<PageContent></PageContent>
		</>
	)
}
