import Link from 'next/link'

import { Icons } from '@/client/components/icons'
import { PageBreadcrumbs } from '@/client/components/page-breadcrumbs'
import { PageContent, PageHeader, PageTitle, PageWrapper } from '@/client/components/page-wrapper'
import { buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

export default function Page() {
	return (
		<PageWrapper>
			<PageHeader className="flex items-end justify-between space-y-0">
				<div className="space-y-1.5">
					<PageTitle className="font-bold">Courses</PageTitle>
					<PageBreadcrumbs withIcons />
				</div>
				<Link href="/course/create" className={cn(buttonVariants(), 'h-10 w-32')}>
					<Icons.plusCircle className="mr-1 size-5 shrink-0" />
					New Course
				</Link>
			</PageHeader>
			<PageContent>
				<Card>
					<CardHeader>
						<CardTitle className="font-medium">Course Statistics</CardTitle>
						<CardDescription>You have [n] courses in total ([n] active).</CardDescription>
					</CardHeader>
					<CardContent></CardContent>
				</Card>
			</PageContent>
		</PageWrapper>
	)
}
