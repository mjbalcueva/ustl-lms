import { PageContent, PageDescription, PageHeader, PageTitle } from '@/client/components/ui/page'

export default function Page() {
	return (
		<>
			<PageHeader>
				<PageTitle>Analytics</PageTitle>
				<PageDescription>Explore your teaching performance and student engagement metrics</PageDescription>
			</PageHeader>
			<PageContent></PageContent>
		</>
	)
}
