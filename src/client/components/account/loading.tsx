import { ItemContent, ItemFooter, ItemHeader, ItemWrapper } from '@/client/components/ui/item'
import {
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle,
	PageWrapper
} from '@/client/components/ui/page'
import { Skeleton } from '@/client/components/ui/skeleton'

export default function Loading() {
	return (
		<PageWrapper>
			<PageContainer>
				<PageHeader>
					<PageTitle>Your Profile</PageTitle>
					<PageDescription>Manage your Scholar profile</PageDescription>
				</PageHeader>

				<PageContent asChild>
					<PageSection className="space-y-4">
						<ItemWrapper>
							<ItemHeader>
								<Skeleton className="h-6 w-40" />
								<Skeleton className="h-4" />
							</ItemHeader>
							<ItemContent>
								<Skeleton className="h-10 md:w-3/5" />
							</ItemContent>
							<ItemFooter className="space-x-2">
								<Skeleton className="h-4 w-4" />
								<Skeleton className="h-4 w-48" />
								<Skeleton className="!ml-auto h-8 w-16" />
							</ItemFooter>
						</ItemWrapper>
					</PageSection>
				</PageContent>
			</PageContainer>
		</PageWrapper>
	)
}
