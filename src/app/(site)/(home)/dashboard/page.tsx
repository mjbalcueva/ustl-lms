import { HydrateClient } from '@/shared/trpc/server'

import { auth } from '@/server/lib/auth'

import { PageContent, PageDescription, PageHeader, PageSection, PageTitle, PageWrapper } from '@/client/components/page'

export default async function Page() {
	const session = await auth()

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
