import { Suspense } from 'react'
import { TRPCError } from '@trpc/server'

import { api } from '@/services/trpc/server'

import { Card, CardContent, CardFooter, CardHeader } from '@/core/components/ui/card'
import { PageContainer, PageDescription, PageHeader, PageTitle } from '@/core/components/ui/page'
import { Skeleton } from '@/core/components/ui/skeleton'

import { EnrollmentDetailsCard } from '@/features/enrollment/components/enrollment-details-card'
import { EnrollmentErrorCard } from '@/features/enrollment/components/enrollment-error-card'
import { enrollmentSchema } from '@/features/enrollment/validations/enrollment'

export default async function Page({ searchParams }: { searchParams: { token: string } }) {
	const parsedToken = enrollmentSchema.safeParse({ token: searchParams.token })

	return (
		<PageContainer className="flex h-full flex-col items-center justify-center">
			<PageHeader className="flex w-full max-w-md flex-col items-center justify-center space-y-0 text-center">
				<PageTitle className="text-3xl font-bold">You have been invited!</PageTitle>
				<PageDescription>Review the course details and enroll below</PageDescription>
			</PageHeader>

			<Suspense
				fallback={
					<Card className="w-full max-w-md">
						<CardHeader className="flex items-center justify-normal gap-2">
							<Skeleton className="h-6 w-3/4" />
							<Skeleton className="h-4 w-9" />
						</CardHeader>
						<CardContent className="space-y-4">
							<Skeleton className="h-40 w-full" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-5/6" />
								<Skeleton className="size-4/5" />
							</div>
							<div className="flex space-x-2">
								<Skeleton className="h-6 w-20" />
								<Skeleton className="h-6 w-24" />
							</div>
							<div className="flex items-center space-x-2">
								<Skeleton className="h-10 w-10 rounded-full" />
								<Skeleton className="h-4 w-32" />
							</div>
						</CardContent>
						<CardFooter>
							<Skeleton className="h-10 w-full" />
						</CardFooter>
					</Card>
				}
			>
				<EnrollmentContent parsedToken={parsedToken} />
			</Suspense>
		</PageContainer>
	)
}

async function EnrollmentContent({
	parsedToken
}: {
	parsedToken: ReturnType<typeof enrollmentSchema.safeParse>
}) {
	if (!parsedToken.success) {
		return (
			<EnrollmentErrorCard
				title="Token Issue"
				description="We couldn't process your enrollment token. It may be expired or incorrect."
				message={parsedToken.error.errors[0]?.message ?? ''}
			/>
		)
	}

	try {
		const course = await api.enrollment.findCourse({ token: parsedToken.data.token })
		return (
			<EnrollmentDetailsCard
				token={parsedToken.data.token}
				code={course.code}
				title={course.title}
				description={course.description}
				categories={course.categories}
				image={course.imageUrl}
				instructor={course.instructor?.profile?.name}
			/>
		)
	} catch (error) {
		const errorMessage =
			error instanceof TRPCError
				? error.message
				: 'An unexpected error occurred while fetching the course details.'

		return (
			<EnrollmentErrorCard
				title="Server Issue"
				description="There was an issue processing your enrollment. Please try again later."
				message={errorMessage}
			/>
		)
	}
}
