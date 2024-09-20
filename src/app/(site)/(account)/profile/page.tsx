import { UpdateDisplayNameForm } from '@/client/components/account/update-display-name'
import { PageContainer, PageContent, PageHeader, PageSection, PageWrapper } from '@/client/components/page'
import { CardDescription, CardTitle } from '@/client/components/ui'

export default async function Page() {
	return (
		<PageWrapper>
			<PageContainer>
				<PageHeader>
					<CardTitle>Your Profile</CardTitle>
					<CardDescription>Manage your Scholar profile</CardDescription>
				</PageHeader>

				<PageContent asChild>
					<PageSection>
						<UpdateDisplayNameForm />
					</PageSection>
				</PageContent>
			</PageContainer>
		</PageWrapper>
	)
}
