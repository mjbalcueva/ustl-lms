import { CardWrapper, CardWrapperHeader } from '@/client/components/card-wrapper'
import { CardDescription, CardTitle } from '@/client/components/ui'

export default function Page() {
	return (
		<CardWrapper>
			<CardWrapperHeader>
				<CardTitle>Profile</CardTitle>
				<CardDescription>Manage your account settings and set up two-factor authentication.</CardDescription>
			</CardWrapperHeader>
		</CardWrapper>
	)
}
