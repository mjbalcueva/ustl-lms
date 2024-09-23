import { UpdateDisplayNameForm } from '@/client/components/account/update-display-name'
import {
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle,
	PageWrapper
} from '@/client/components/ui'

export default async function Page() {
	return (
		<PageWrapper>
			<PageContainer>
				<PageHeader>
					<PageTitle>Your Profile</PageTitle>
					<PageDescription>Manage your Scholar profile</PageDescription>
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
