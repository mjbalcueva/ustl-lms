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
				<PageTitle>Account Settings</PageTitle>
				<PageDescription>Manage your account security settings</PageDescription>
			</PageHeader>

			<PageContent className="space-y-4">
				<PageSection>
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-40" />
							<Skeleton className="h-4" />
						</CardHeader>
						<CardContent withSeparator>
							<Skeleton className="h-20" />
						</CardContent>
						<CardFooter className="space-x-2">
							<Skeleton className="size-4" />
							<Skeleton className="h-4 w-20" />
							<Skeleton className="!ml-auto h-8 w-16" />
						</CardFooter>
					</Card>
				</PageSection>

				<PageSection>
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-40" />
							<Skeleton className="h-4" />
						</CardHeader>
						<CardContent className="space-y-4" withSeparator>
							<div className="space-y-2">
								<Skeleton className="size-40" />
								<Skeleton className="h-10 md:w-3/4" />
							</div>
							<div className="space-y-2">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-10 md:w-3/4" />
							</div>
							<div className="space-y-2">
								<Skeleton className="size-48" />
								<Skeleton className="h-10 md:w-3/4" />
							</div>
						</CardContent>
						<CardFooter className="space-x-2">
							<Skeleton className="size-4" />
							<Skeleton className="h-4 w-20" />
							<Skeleton className="!ml-auto h-8 w-16" />
						</CardFooter>
					</Card>
				</PageSection>
			</PageContent>
		</PageContainer>
	)
}
