import { ChangePasswordForm } from '@/client/components/account/change-password-form'
import { TwoFactorAuthenticationForm } from '@/client/components/account/two-factor-authentication-form'
import { CardWrapper, CardWrapperContent, CardWrapperHeader } from '@/client/components/card-wrapper'
import { CardDescription, CardTitle } from '@/client/components/ui'

export default function Page() {
	return (
		<CardWrapper>
			<div className="flex flex-col items-center justify-center">
				<CardWrapperHeader className="w-full sm:w-[38.5rem]">
					<CardTitle>Account Settings</CardTitle>
					<CardDescription>Manage your account security settings</CardDescription>
				</CardWrapperHeader>
				<CardWrapperContent className="w-full space-y-4 sm:w-[38.5rem]">
					<TwoFactorAuthenticationForm />
					<ChangePasswordForm />
				</CardWrapperContent>
			</div>
		</CardWrapper>
	)
}
