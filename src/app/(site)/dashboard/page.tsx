import { api } from '@/services/trpc/server'

import {
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle
} from '@/core/components/ui/page'

export default async function Page() {
	const session = await api.session.getSession()

	return (
		<>
			<PageHeader>
				<PageTitle>Dashboard</PageTitle>
				<PageDescription>Welcome to your personal dashboard</PageDescription>
			</PageHeader>
			<PageContent>
				<PageSection>
					<pre>{JSON.stringify(session, null, 2)}</pre>
				</PageSection>
			</PageContent>
		</>
	)
}
