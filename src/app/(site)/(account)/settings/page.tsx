import { auth } from '@/services/authjs/auth'

import {
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle
} from '@/core/components/ui/page'

import { AddPasswordForm } from '@/features/account/components/forms/add-password-form'
import { EditPasswordForm } from '@/features/account/components/forms/edit-password-form'
import { EditTwoFactorForm } from '@/features/account/components/forms/edit-two-factor-form'

export default async function Page() {
	const session = await auth()

	return (
		<PageContainer>
			<PageHeader>
				<PageTitle>Account Settings</PageTitle>
				<PageDescription>Manage your account security settings</PageDescription>
			</PageHeader>

			<PageContent className="space-y-4">
				<PageSection>
					<EditTwoFactorForm />
				</PageSection>

				<PageSection>
					{session?.user.hasPassword ? <EditPasswordForm /> : <AddPasswordForm />}
				</PageSection>
			</PageContent>
		</PageContainer>
	)
}
