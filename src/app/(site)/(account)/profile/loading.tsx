import {
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle
} from '@/core/components/ui/page'
import { Skeleton } from '@/core/components/ui/skeleton'

import { Card, CardContent, CardFooter, CardHeader } from '@/features/account/components/ui/card'

export default function Loading() {
	return (
		<PageContainer>
			<PageHeader>
				<PageTitle>Your Profile</PageTitle>
				<PageDescription>Manage your Scholar profile</PageDescription>
			</PageHeader>

			<PageContent asChild>
				<PageSection className="space-y-4">
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-40" />
							<Skeleton className="h-4" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-10 md:w-3/5" />
						</CardContent>
						<CardFooter className="space-x-2">
							<Skeleton className="size-4" />
							<Skeleton className="size-48" />
							<Skeleton className="!ml-auto h-8 w-16" />
						</CardFooter>
					</Card>
				</PageSection>
			</PageContent>
		</PageContainer>
	)
}
