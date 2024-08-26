import { CardWrapper } from '@/client/components/card-wrapper'
import { CardDescription, CardHeader, CardTitle } from '@/client/components/ui'

export default function Page() {
	return (
		<CardWrapper showBreadcrumbs>
			<CardHeader>
				<CardTitle>Profile</CardTitle>
				<CardDescription>Manage your profile</CardDescription>
			</CardHeader>
		</CardWrapper>
	)
}
