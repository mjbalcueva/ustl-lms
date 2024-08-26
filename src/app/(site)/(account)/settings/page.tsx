import { SettingsForm } from '@/client/components/account/settings-form'
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
				<CardWrapperContent className="w-full sm:w-[38.5rem]">
					<SettingsForm />
				</CardWrapperContent>
			</div>
		</CardWrapper>
	)
}
