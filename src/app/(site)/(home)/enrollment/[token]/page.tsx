import { type Breadcrumb } from '@/shared/types/breadcrumbs'

import { EnrollmentForm } from '@/client/components/enrollment/enrollment'
import { PageBreadcrumbs, PageContainer, PageHeader } from '@/client/components/ui/page'
import { Separator } from '@/client/components/ui/separator'

export default function Page({ params }: { params: { token: string } }) {
	const { token } = params

	const crumbs: Breadcrumb = [{ icon: 'home' }, { label: 'Enrollment', href: '/enrollment' }, { label: 'Join' }]

	return (
		<>
			<PageHeader className="hidden space-y-0 md:block md:py-3">
				<PageBreadcrumbs crumbs={crumbs} />
			</PageHeader>

			<Separator className="hidden md:block" />

			<PageContainer className="flex flex-col items-center justify-center md:h-[calc(100vh-10rem)]">
				<EnrollmentForm token={token} />
			</PageContainer>
		</>
	)
}
