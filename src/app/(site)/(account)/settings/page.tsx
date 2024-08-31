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

export default function Page() {
	return (
		<PageWrapper>
			<PageContainer>
				<PageHeader>
					<PageTitle>Account Settings</PageTitle>
					<PageDescription>Manage your account security settings</PageDescription>
				</PageHeader>
				<PageContent className="space-y-4">
					<Toggle2FAForm />
					<UpdatePasswordForm />
				</PageContent>
			</PageContainer>
		</PageWrapper>
	)
}
