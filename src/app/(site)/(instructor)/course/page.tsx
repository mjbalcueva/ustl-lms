import { PageBreadcrumbs } from '@/client/components/page-breadcrumbs'
import { PageWrapper } from '@/client/components/page-wrapper'

export default function Page() {
	return (
		<PageWrapper>
			<PageBreadcrumbs baseCrumb="Instructor" withIcons />
		</PageWrapper>
	)
}
