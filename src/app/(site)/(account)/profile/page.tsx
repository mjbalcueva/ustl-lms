import { PageHeader, PageWrapper } from '@/client/components/page-wrapper'
import { CardDescription, CardTitle } from '@/client/components/ui'

export default function Page() {
	return (
		<PageWrapper>
			<PageHeader>
				<CardTitle>Profile</CardTitle>
				<CardDescription>Manage your Scholar profile</CardDescription>
			</PageHeader>
		</PageWrapper>
	)
}
