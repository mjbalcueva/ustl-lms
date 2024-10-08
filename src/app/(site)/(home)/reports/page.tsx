import { PageContent, PageDescription, PageHeader, PageTitle, PageWrapper } from '@/client/components/ui'

export default async function Page() {
	return (
		<PageWrapper>
			<PageHeader>
				<PageTitle>Reports</PageTitle>
				<PageDescription>View your reports</PageDescription>
			</PageHeader>
			<PageContent></PageContent>
		</PageWrapper>
	)
}
