import { PageBreadcrumbs } from '@/client/components/page-breadcrumbs'
import { PageContainer, PageContent, PageHeader, PageTitle, PageWrapper } from '@/client/components/page-wrapper'

export default function Page() {
	return (
		<PageWrapper>
			<PageContainer className="flex h-full flex-col items-center justify-center">
				<PageHeader className="flex flex-wrap items-end justify-between gap-4 space-y-0">
					<div className="space-y-1.5">
						<PageTitle className="font-bold">Create a New Course</PageTitle>
						<PageBreadcrumbs withIcons />
					</div>
				</PageHeader>
				<PageContent>rawr</PageContent>
			</PageContainer>
		</PageWrapper>
	)
}
