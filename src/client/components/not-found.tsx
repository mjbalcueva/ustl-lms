import { Breadcrumbs, PageDescription, PageHeader, PageTitle, PageWrapper, type Crumb } from '@/client/components/page'
import { Separator } from '@/client/components/ui'

const NotFound = () => {
	const crumbs: Crumb[] = [
		{ icon: 'instructor' },
		{ label: 'Error' },
		{ label: '404', href: '/404' },
		{ label: 'Page Not Found' }
	]

	return (
		<PageWrapper>
			<PageHeader className="hidden space-y-0 md:block md:py-3">
				<Breadcrumbs crumbs={crumbs} />
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
