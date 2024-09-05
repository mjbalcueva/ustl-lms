import { PageContent, PageDescription, PageHeader, PageTitle, PageWrapper } from '@/client/components/page-wrapper'

export default function Page() {
	return (
		<PageWrapper>
			<PageHeader>
				<PageTitle>Courses</PageTitle>
				<PageDescription>Manage your courses</PageDescription>
			</PageHeader>
			<PageContent></PageContent>
		</PageWrapper>
	)
}
