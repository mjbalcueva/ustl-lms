import { PageContent, PageDescription, PageHeader, PageTitle } from '@/client/components/ui/page'

export default async function Page() {
	return (
		<>
			<PageHeader>
				<PageTitle>Reports</PageTitle>
				<PageDescription>View your reports</PageDescription>
			</PageHeader>
			<PageContent></PageContent>
		</>
	)
}
