import { CardWrapper, CardWrapperHeader } from '@/client/components/card-wrapper'
import { CardDescription, CardTitle } from '@/client/components/ui'

export default function Page() {
	return (
		<CardWrapper>
			<CardWrapperHeader>
				<CardTitle>Settings</CardTitle>
				<CardDescription>Manage your account security</CardDescription>
			</CardWrapperHeader>
		</CardWrapper>
	)
}
