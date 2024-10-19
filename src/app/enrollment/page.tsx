import { Metadata } from 'next'
import { Suspense } from 'react'
import { TRPCError } from '@trpc/server'

import { api } from '@/shared/trpc/server'
import { enrollmentSchema } from '@/shared/validations/enrollment'

import { EnrollmentDetailsCard } from '@/client/components/enrollment/enrollment-details-card'
import { EnrollmentErrorCard } from '@/client/components/enrollment/enrollment-error-card'
import { EnrollmentSkeleton } from '@/client/components/skeleton/enrollment-skeleton'
import { PageContainer, PageDescription, PageHeader, PageTitle } from '@/client/components/ui/page'

export async function generateMetadata({ searchParams }: { searchParams: { token: string } }): Promise<Metadata> {
	const parsedToken = enrollmentSchema.safeParse({ token: searchParams.token })

	if (!parsedToken.success) {
		return {
			title: 'Enrollment Error | Course Enrollment',
			description: 'There was an issue with the enrollment token. Please check your invitation link and try again.'
		}
	}

	try {
		const course = await api.enrollment.findCourse({ token: parsedToken.data.token })
		return {
			title: `Enroll in ${course.title} | Course Enrollment`,
			description: `You've been invited to join ${course.title}. ${course.description?.slice(0, 150)}...`
		}
	} catch (error) {
		return {
			title: 'Enrollment Error | Course Enrollment',
			description: 'An error occurred while fetching course details. Please try again later.'
		}
	}
}

export default async function Page({ searchParams }: { searchParams: { token: string } }) {
	const parsedToken = enrollmentSchema.safeParse({ token: searchParams.token })

	return (
		<PageContainer className="flex h-full flex-col items-center justify-center">
			<PageHeader className="flex w-full max-w-md flex-col items-center justify-center space-y-0 text-center">
				<PageTitle className="text-3xl font-bold">You have been invited!</PageTitle>
				<PageDescription>Review the course details and enroll below</PageDescription>
			</PageHeader>

			<Suspense fallback={<EnrollmentSkeleton />}>
				<EnrollmentContent parsedToken={parsedToken} />
			</Suspense>
		</PageContainer>
	)
}

async function EnrollmentContent({ parsedToken }: { parsedToken: ReturnType<typeof enrollmentSchema.safeParse> }) {
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
			error instanceof TRPCError ? error.message : 'An unexpected error occurred while fetching the course details.'

		return (
			<EnrollmentErrorCard
				title="Server Issue"
				description="There was an issue processing your enrollment. Please try again later."
				message={errorMessage}
			/>
		)
	}
}
