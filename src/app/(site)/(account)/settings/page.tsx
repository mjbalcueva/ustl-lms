import { auth } from '@/server/lib/auth'

import { AddPasswordForm } from '@/client/components/account/add-password'
import { Toggle2FAForm } from '@/client/components/account/toggle-2fa'
import { UpdatePasswordForm } from '@/client/components/account/update-password'
import {
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle,
	PageWrapper
} from '@/client/components/ui/page'

export default async function Page() {
	const session = await auth()

	return (
		<PageWrapper>
			<PageContainer>
				<PageHeader>
					<PageTitle>Account Settings</PageTitle>
					<PageDescription>Manage your account security settings</PageDescription>
				</PageHeader>

				<PageContent className="space-y-4">
					<PageSection>
						<Toggle2FAForm />
					</PageSection>

					<PageSection>{session?.user.hasPassword ? <UpdatePasswordForm /> : <AddPasswordForm />}</PageSection>
				</PageContent>
			</PageContainer>
		</PageWrapper>
	)
}
