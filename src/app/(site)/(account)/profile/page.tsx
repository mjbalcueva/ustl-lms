import {
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle
} from '@/core/components/ui/page'

import { EditBioForm } from '@/features/account/components/forms/edit-bio-form'
import { EditNameForm } from '@/features/account/components/forms/edit-name-form'

export default async function Page() {
	return (
		<PageContainer>
			<PageHeader>
				<PageTitle>Your Profile</PageTitle>
				<PageDescription>Manage your Scholar profile</PageDescription>
			</PageHeader>

			<PageContent className="space-y-4">
				<PageSection>
					<EditNameForm />
				</PageSection>

				<PageSection>
					<EditBioForm />
				</PageSection>
			</PageContent>
		</PageContainer>
	)
}
