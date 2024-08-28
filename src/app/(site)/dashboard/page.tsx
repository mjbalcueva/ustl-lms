import { auth } from '@/server/lib/auth'

import { PageContent, PageDescription, PageHeader, PageTitle, PageWrapper } from '@/client/components/page-wrapper'

export default async function Page() {
	const session = await auth()

	return (
		<PageWrapper>
			<PageHeader>
				<PageTitle>Dashboard</PageTitle>
				<PageDescription>Welcome to your personal dashboard</PageDescription>
			</PageHeader>
			<PageContent>
				<pre>{JSON.stringify(session, null, 2)}</pre>
			</PageContent>
		</PageWrapper>
	)
}
