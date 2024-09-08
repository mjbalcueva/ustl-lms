import { api, HydrateClient } from '@/shared/trpc/server'

import {
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle,
	PageWrapper
} from '@/client/components/page-wrapper'

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
					<PageSection>
						<pre>{JSON.stringify(session, null, 2)}</pre>
					</PageSection>
				</PageContent>
			</PageWrapper>
		</HydrateClient>
	)
}
