import { PageBreadcrumbs } from '@/client/components/page-breadcrumbs'
import { PageContent, PageDescription, PageHeader, PageTitle, PageWrapper } from '@/client/components/page-wrapper'

export default function Page() {
	return (
		<PageWrapper>
			<PageBreadcrumbs baseCrumb="Instructor" withIcons />
			<PageHeader className="md:pt-4">
				<PageTitle>Create Course</PageTitle>
				<PageDescription>Create a new course</PageDescription>
			</PageHeader>
			<PageContent></PageContent>
		</PageWrapper>
	)
}
