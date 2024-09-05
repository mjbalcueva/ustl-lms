import { api, HydrateClient } from '@/shared/trpc/server'

import { PageContent, PageDescription, PageHeader, PageTitle, PageWrapper } from '@/client/components/page-wrapper'

export default async function Page() {
	const session = await api.auth.getSession()
	void api.auth.getSession.prefetch()

	return (
		<HydrateClient>
			<PageWrapper>
				<PageHeader>
					<PageTitle>Dashboard</PageTitle>
					<PageDescription>Welcome to your personal dashboard</PageDescription>
				</PageHeader>
				<PageContent>
					<pre>{JSON.stringify(session, null, 2)}</pre>
				</PageContent>
			</PageWrapper>
		</HydrateClient>
	)
}
