import Image from 'next/image'

import { api } from '@/services/trpc/server'

import { NotFound } from '@/core/components/error-pages/not-found'
import { Badge } from '@/core/components/ui/badge'
import { Banner } from '@/core/components/ui/banner'
import {
	PageBreadcrumbs,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle
} from '@/core/components/ui/page'
import { Progress } from '@/core/components/ui/progress'
import { Separator } from '@/core/components/ui/separator'
import { CourseSingle, Home } from '@/core/lib/icons'
import { type Breadcrumb } from '@/core/types/breadcrumbs'

import { CourseCopyInviteButton } from '@/features/courses/components/course-copy-invite-button'
import CourseInstructorCard from '@/features/courses/components/course-instructor-card'
import { CourseTabs } from '@/features/courses/components/tabs/course-tabs'

export default async function Page({ params }: { params: { courseId: string } }) {
	const { courseId } = params

	const { course } = await api.course.findEnrolledCourseDetails({ courseId })
	if (!course) return <NotFound item="course" />

	const crumbs: Breadcrumb = [
		{ icon: Home },
		{ label: 'Learning', href: '/courses' },
		{ icon: CourseSingle, label: course.code, href: `/courses/${courseId}` }
	]

	return (
		<>
			<PageHeader className="hidden space-y-0 md:block md:py-3">
				<PageBreadcrumbs crumbs={crumbs} />
			</PageHeader>

			<Separator className="hidden md:block" />

			{course.status !== 'PUBLISHED' && (
				<Banner
					label="This course is archived. You can still access it, but new enrollments are closed."
					variant="info"
				/>
			)}

			<PageHeader className="flex flex-col flex-wrap justify-center space-y-3 md:flex-row md:gap-4 md:pt-4">
				<div className="relative hidden aspect-video flex-1 rounded-lg shadow-md md:block md:min-w-[249px] md:max-w-xs">
					<Image
						src={course.imageUrl ?? '/assets/placeholder.svg'}
						alt={course.title}
						className="rounded-lg border-2 border-accent object-cover"
						fill
						priority
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				</div>

				<div className="flex flex-[2] flex-col space-y-2 md:min-w-[500px]">
					<div className="flex items-start justify-between">
						<div className="flex flex-col gap-2">
							<PageTitle>{course.title}</PageTitle>

							<div className="flex flex-wrap items-center gap-1">
								{course.categories.map((category) => (
									<Badge key={category.id} variant="secondary">
										{category.name}
									</Badge>
								))}
							</div>
						</div>
						<CourseCopyInviteButton token={course.token ?? ''} />
					</div>

					<PageDescription className="min-h-16 w-full md:line-clamp-3">
						{course.description}
					</PageDescription>

					<div className="space-y-1">
						<div className="flex justify-between text-sm">
							<span>Course Progress</span>
							<span>{course.progress}%</span>
						</div>
						<Progress value={course.progress} className="w-full" />
					</div>
				</div>
			</PageHeader>

			<PageContent className="mb-24 space-y-6 px-2.5 pt-6 sm:px-4 md:mb-12 md:flex md:flex-wrap md:gap-6 md:space-y-0 md:px-6">
				<PageSection className="flex-[2] md:min-w-[500px]" columnMode>
					<CourseTabs course={course} />
				</PageSection>

				<PageSection className="md:min-w-[350px]" columnMode>
					<CourseInstructorCard
						name={course.instructor.profile.name ?? ''}
						bio={course.instructor.profile.bio ?? ''}
						email={course.instructor.email ?? ''}
						imageUrl={course.instructor.profile.imageUrl ?? ''}
					/>
				</PageSection>
			</PageContent>
		</>
	)
}