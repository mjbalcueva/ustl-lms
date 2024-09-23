'use client'

import { useRouter } from 'next/navigation'

import { type Breadcrumb } from '@/shared/types/breadcrumbs'

import {
	Button,
	PageBreadcrumbs,
	PageDescription,
	PageHeader,
	PageTitle,
	PageWrapper,
	Separator
} from '@/client/components/ui'

const NotFound = ({ item = 'page' }: { item?: string }) => {
	const router = useRouter()

	const itemText = item.charAt(0).toUpperCase() + item.slice(1)

	const crumbs: Breadcrumb = [
		{ icon: 'instructor' },
		{ label: 'Error' },
		{ label: '404', href: '/404' },
		{ label: `${itemText} Not Found` }
	]

	return (
		<PageWrapper>
			<PageHeader className="hidden space-y-0 md:block md:py-3">
				<PageBreadcrumbs crumbs={crumbs} />
			</PageHeader>

			<Separator />

			<PageHeader>
				<PageTitle className="font-bold">404 - {itemText} Not Found</PageTitle>
				<PageDescription>
					The {item} you are looking for does not exist. It might have been moved or deleted.
				</PageDescription>
				<Button size="link" variant="link" onClick={() => router.back()}>
					Go back?
				</Button>
			</PageHeader>
		</PageWrapper>
	)
}

export { NotFound }
