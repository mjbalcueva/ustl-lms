import { auth } from '@/server/lib/auth'

import { AddPasswordForm } from '@/client/components/account/forms/add-password'
import { Toggle2FAForm } from '@/client/components/account/forms/toggle-2fa'
import { UpdatePasswordForm } from '@/client/components/account/forms/update-password'
import {
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageTitle,
	PageWrapper
} from '@/client/components/page-wrapper'

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
					<Toggle2FAForm />
					{session?.user.hasPassword ? <UpdatePasswordForm /> : <AddPasswordForm />}
				</PageContent>
			</PageContainer>
		</PageWrapper>
	)
}
