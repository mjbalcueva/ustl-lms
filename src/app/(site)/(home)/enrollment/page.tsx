import Link from 'next/link'

import { type Breadcrumb } from '@/shared/types/breadcrumbs'
import { enrollmentSchema } from '@/shared/validations/enrollment'

import { FormResponse } from '@/client/components/auth/form-response'
import { EnrollmentCard } from '@/client/components/enrollment/enrollment-card'
import { buttonVariants } from '@/client/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/client/components/ui/card'
import { PageBreadcrumbs, PageContainer, PageHeader } from '@/client/components/ui/page'
import { Separator } from '@/client/components/ui/separator'
import { cn } from '@/client/lib/utils'

export default function Page({ searchParams }: { searchParams: { token: string } }) {
	const parsedToken = enrollmentSchema.safeParse({ token: searchParams.token })

	const crumbs: Breadcrumb = [{ icon: 'home' }, { label: 'Enrollment', href: '/enrollment' }, { label: 'Join' }]

	return (
		<>
			<PageHeader className="hidden space-y-0 md:block md:py-3">
				<PageBreadcrumbs crumbs={crumbs} />
			</PageHeader>

			<Separator className="hidden md:block" />

			<PageContainer className="flex flex-col items-center justify-center md:h-[calc(100vh-10rem)]">
				{parsedToken.success ? (
					<EnrollmentCard token={parsedToken.data.token} />
				) : (
					<Card className="w-full max-w-md">
						<CardHeader className="flex flex-col items-start py-6">
							<CardTitle className="text-2xl">Token Issue</CardTitle>
							<CardDescription>
								We couldn&apos;t process your enrollment token. It may be expired or incorrect.
							</CardDescription>
						</CardHeader>
						<CardContent className="pb-6">
							<FormResponse type="error" message={parsedToken.error?.errors[0]?.message} />
						</CardContent>
						<CardFooter>
							<Link href="/dashboard" className={cn(buttonVariants({ variant: 'link', size: 'link' }))}>
								Go to dashboard
							</Link>
						</CardFooter>
					</Card>
				)}
			</PageContainer>
		</>
	)
}
