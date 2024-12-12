import { api } from '@/services/trpc/server'

import {
	PageBreadcrumbs,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle
} from '@/core/components/ui/page'
import { Separator } from '@/core/components/ui/separator'
import { Users } from '@/core/lib/icons'
import { type Breadcrumb } from '@/core/types/breadcrumbs'

import { DataTable } from '@/features/role-management/components/data-table/data-table'

export default async function Page() {
	const { users } = await api.roleManagement.findManyUsers()

	const crumbs: Breadcrumb = [
		{ icon: Users },
		{ label: 'Role Management', href: '/role-management/' }
	]

	return (
		<>
			<PageHeader className="hidden space-y-0 md:flex md:py-3">
				<PageBreadcrumbs crumbs={crumbs} />
			</PageHeader>

			<Separator className="hidden md:block" />

			<PageHeader className="flex flex-wrap items-end justify-between gap-4 space-y-0">
				<div>
					<PageTitle className="font-bold">Role Management</PageTitle>
					<PageDescription>
						Manage user roles and permissions within the system.
					</PageDescription>
				</div>
			</PageHeader>

			<PageContent>
				<PageSection>
					<DataTable data={users} />
				</PageSection>
			</PageContent>
		</>
	)
}
