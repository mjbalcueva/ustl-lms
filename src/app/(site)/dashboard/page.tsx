import { auth } from '@/services/authjs/auth'

import {
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle
} from '@/core/components/ui/page'

export default async function Page() {
	const session = await auth()

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
