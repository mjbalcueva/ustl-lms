import { PageBreadcrumbs, PageHeader } from '@/core/components/ui/page'
import { Separator } from '@/core/components/ui/separator'
import { CourseSingle, Home } from '@/core/lib/icons'
import { type Breadcrumb } from '@/core/types/breadcrumbs'

export default function Loading() {
	const crumbs: Breadcrumb = [
		{ icon: Home },
		{ label: 'Learning', href: '/courses' },
		{ icon: CourseSingle, label: 'Loading...' }
	]

	return (
		<>
			<PageHeader className="hidden space-y-0 md:block md:py-3">
				<PageBreadcrumbs crumbs={crumbs} />
			</PageHeader>

			<Separator className="hidden md:block" />
		</>
	)
}
