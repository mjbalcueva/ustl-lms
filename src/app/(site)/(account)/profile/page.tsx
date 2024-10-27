import {
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle
} from '@/core/components/ui/page'

import { EditNameForm } from '@/features/account/components/forms/edit-name-form'

export default async function Page() {
	return (
		<PageContainer>
			<PageHeader>
				<PageTitle>Your Profile</PageTitle>
				<PageDescription>Manage your Scholar profile</PageDescription>
			</PageHeader>

			<PageContent asChild>
				<PageSection>
					<EditNameForm />
				</PageSection>
			</PageContent>
		</PageContainer>
	)
}
