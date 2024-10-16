import { ItemContent, ItemFooter, ItemHeader, ItemWrapper } from '@/client/components/item'
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
					<PageTitle>Account Settings</PageTitle>
					<PageDescription>Manage your account security settings</PageDescription>
				</PageHeader>

				<PageContent className="space-y-4">
					<PageSection>
						<ItemWrapper>
							<ItemHeader>
								<Skeleton className="h-6 w-40" />
								<Skeleton className="h-4" />
							</ItemHeader>
							<ItemContent withSeparator>
								<Skeleton className="h-20" />
							</ItemContent>
							<ItemFooter className="space-x-2">
								<Skeleton className="h-4 w-4" />
								<Skeleton className="h-4 w-20" />
								<Skeleton className="!ml-auto h-8 w-16" />
							</ItemFooter>
						</ItemWrapper>
					</PageSection>

					<PageSection>
						<ItemWrapper>
							<ItemHeader>
								<Skeleton className="h-6 w-40" />
								<Skeleton className="h-4" />
							</ItemHeader>
							<ItemContent className="space-y-4" withSeparator>
								<div className="space-y-2">
									<Skeleton className="h-4 w-40" />
									<Skeleton className="h-10 md:w-3/4" />
								</div>
								<div className="space-y-2">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-10 md:w-3/4" />
								</div>
								<div className="space-y-2">
									<Skeleton className="h-4 w-48" />
									<Skeleton className="h-10 md:w-3/4" />
								</div>
							</ItemContent>
							<ItemFooter className="space-x-2">
								<Skeleton className="h-4 w-4" />
								<Skeleton className="h-4 w-20" />
								<Skeleton className="!ml-auto h-8 w-16" />
							</ItemFooter>
						</ItemWrapper>
					</PageSection>
				</PageContent>
			</PageContainer>
		</PageWrapper>
	)
}
