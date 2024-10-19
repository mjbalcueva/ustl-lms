import { Suspense } from 'react'
import { TRPCError } from '@trpc/server'

import { api } from '@/shared/trpc/server'
import { type Breadcrumb } from '@/shared/types/breadcrumbs'
import { enrollmentSchema } from '@/shared/validations/enrollment'

import { EnrollmentDetailsCard } from '@/client/components/enrollment/enrollment-details-card'
import { EnrollmentErrorCard } from '@/client/components/enrollment/enrollment-error-card'
import { EnrollmentSkeleton } from '@/client/components/enrollment/enrollment-skeleton'
import { PageBreadcrumbs, PageContainer, PageHeader, PageTitle } from '@/client/components/ui/page'
import { Separator } from '@/client/components/ui/separator'

export default async function Page({ searchParams }: { searchParams: { token: string } }) {
	const parsedToken = enrollmentSchema.safeParse({ token: searchParams.token })
	const crumbs: Breadcrumb = [{ icon: 'home' }, { label: 'Enrollment', href: '/enrollment' }, { label: 'Join' }]

	return (
		<>
			<PageHeader className="hidden space-y-0 md:block md:py-3">
				<PageBreadcrumbs crumbs={crumbs} />
			</PageHeader>

			<Separator className="hidden md:block" />

			<PageContainer className="flex flex-col items-center justify-center md:h-[calc(100vh-10rem)]">
				<PageHeader className="flex-col items-center">
					<PageTitle>Enroll</PageTitle>
				</PageHeader>

				<Suspense fallback={<EnrollmentSkeleton />}>
					<EnrollmentContent parsedToken={parsedToken} />
				</Suspense>
			</PageContainer>
		</>
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
		const course = await api.enrollment.findClass({ token: parsedToken.data.token })
		return (
			<EnrollmentDetailsCard
				title={course.title}
				description={course.description}
				categories={course.categories}
				image={course.imageUrl}
				code={course.code}
				instructorName={course.instructor?.profile?.name}
				instructorImage={course.instructor?.profile?.image}
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
