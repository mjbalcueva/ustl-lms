import { UpdateDisplayNameForm } from '@/client/components/account/forms/update-display-name'
import { PageContainer, PageContent, PageHeader, PageWrapper } from '@/client/components/page-wrapper'
import { CardDescription, CardTitle } from '@/client/components/ui'

export default function Page() {
	return (
		<PageWrapper>
			<PageContainer>
				<PageHeader>
					<CardTitle>Profile</CardTitle>
					<CardDescription>Manage your Scholar profile</CardDescription>
				</PageHeader>
				<PageContent>
					<UpdateDisplayNameForm />
				</PageContent>
			</PageContainer>
		</PageWrapper>
	)
}
