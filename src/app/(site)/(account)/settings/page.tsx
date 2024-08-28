import { ChangePasswordForm } from '@/client/components/account/change-password-form'
import { TwoFactorAuthenticationForm } from '@/client/components/account/two-factor-authentication-form'
import { PageBreadcrumbs, PageContent, PageHeader, PageWrapper } from '@/client/components/page-wrapper'
import { CardDescription, CardTitle } from '@/client/components/ui'

export default function Page() {
	return (
		<PageWrapper>
			<PageBreadcrumbs />
			<PageHeader>
				<CardTitle className="w-fit">Account Settings</CardTitle>
				<CardDescription className="w-fit">Manage your account security settings</CardDescription>
			</PageHeader>
			<PageContent className="space-y-4">
				<TwoFactorAuthenticationForm />
				<ChangePasswordForm />
			</PageContent>
		</PageWrapper>
	)
}
