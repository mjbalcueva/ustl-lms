import { ChangePasswordForm } from '@/client/components/account/change-password-form'
import { TwoFactorAuthenticationForm } from '@/client/components/account/two-factor-authentication-form'
import { PageBreadcrumbs, PageContent, PageHeader, PageWrapper } from '@/client/components/page-wrapper'
import { CardDescription, CardTitle } from '@/client/components/ui'

export default function Page() {
	return (
		<PageWrapper>
			<PageBreadcrumbs />
			<PageHeader>
				<CardTitle>Account Settings</CardTitle>
				<CardDescription>Manage your account security settings</CardDescription>
			</PageHeader>
			<PageContent>
				<TwoFactorAuthenticationForm />
				<ChangePasswordForm />

				<TwoFactorAuthenticationForm />
				<ChangePasswordForm />

				<TwoFactorAuthenticationForm />
				<ChangePasswordForm />
			</PageContent>
		</PageWrapper>
	)
}
