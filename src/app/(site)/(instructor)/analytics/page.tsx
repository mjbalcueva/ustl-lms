import { PageContent, PageDescription, PageHeader, PageTitle, PageWrapper } from '@/client/components/page'

export default function Page() {
	return (
		<PageWrapper>
			<PageHeader>
				<PageTitle>Analytics</PageTitle>
				<PageDescription>Explore your teaching performance and student engagement metrics</PageDescription>
			</PageHeader>
			<PageContent></PageContent>
		</PageWrapper>
	)
}
