import Link from 'next/link'

import { PageContent, PageDescription, PageHeader, PageTitle, PageWrapper } from '@/client/components/page-wrapper'
import { buttonVariants, Separator } from '@/client/components/ui'

export default function Page() {
	return (
		<PageWrapper>
			<div className="flex items-center justify-between p-4 md:p-6">
				<Link href="/course/create" className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
					Create Course
				</Link>
			</div>
			<Separator />
			<PageHeader>
				<PageTitle>Courses</PageTitle>
				<PageDescription>Manage your courses</PageDescription>
			</PageHeader>
			<PageContent></PageContent>
		</PageWrapper>
	)
}
