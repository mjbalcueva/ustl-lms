import { type Breadcrumb } from '@/shared/types/breadcrumbs'

import { PageBreadcrumbs, PageDescription, PageHeader, PageTitle, PageWrapper, Separator } from '@/client/components/ui'

const NotFound = () => {
	const crumbs: Breadcrumb = [
		{ icon: 'instructor' },
		{ label: 'Error' },
		{ label: '404', href: '/404' },
		{ label: 'Page Not Found' }
	]

	return (
		<PageWrapper>
			<PageHeader className="hidden space-y-0 md:block md:py-3">
				<PageBreadcrumbs crumbs={crumbs} />
			</PageHeader>

			<Separator />

			<PageHeader>
				<PageTitle className="font-bold">404 - Page Not Found</PageTitle>
				<PageDescription>The page you are looking for does not exist.</PageDescription>
			</PageHeader>
		</PageWrapper>
	)
}

export { NotFound }
