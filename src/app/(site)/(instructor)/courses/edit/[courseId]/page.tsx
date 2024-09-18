import { TbBook2, TbListDetails, TbPackage } from 'react-icons/tb'

import { api, HydrateClient } from '@/shared/trpc/server'

import { IconBadge } from '@/client/components/icon-badge'
import { UpdateCode } from '@/client/components/instructor/course/forms/update-code'
import { UpdateDescription } from '@/client/components/instructor/course/forms/update-description'
import { UpdateImage } from '@/client/components/instructor/course/forms/update-image'
import { UpdateTitle } from '@/client/components/instructor/course/forms/update-title'
import { NotFound } from '@/client/components/not-found'
import { Breadcrumbs, type Crumb } from '@/client/components/page-breadcrumbs'
import {
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle,
	PageWrapper
} from '@/client/components/page-wrapper'
import { Separator } from '@/client/components/ui'

export default async function Page({ params }: { params: { courseId: string } }) {
	const { course } = await api.course.getCourse({ courseId: params.courseId })

	if (!course) return <NotFound />

	const requiredFields = [
		course.code,
		course.title,
		course.description,
		course.image,
		course.categoryId,
		course.isPublished
	]

	const totalFields = requiredFields.length
	const completedFields = requiredFields.filter(Boolean).length
	const completionText = `(${completedFields}/${totalFields})`

	const crumbs: Crumb[] = [
		{ icon: 'instructor' },
		{ label: 'Courses', href: '/courses' },
		{ label: 'Edit' },
		{ icon: 'draftCourse', label: course.title }
	]

	return (
		<HydrateClient>
			<PageWrapper>
				<PageHeader className="hidden space-y-0 md:block md:py-3">
					<Breadcrumbs crumbs={crumbs} />
				</PageHeader>

				<Separator className="hidden md:block" />

				<PageHeader>
					<PageTitle className="font-bold">Course Setup</PageTitle>
					<PageDescription>Completed {completionText}</PageDescription>
				</PageHeader>

				<PageContent>
					<PageSection className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<div className="mb-2.5 flex items-center gap-x-2 sm:mb-4 md:mb-5">
								<IconBadge icon={TbBook2} />
								<h2 className="text-xl">Customize your course</h2>
							</div>
							<UpdateCode courseId={course.id} initialData={{ code: course.code }} />
							<UpdateTitle courseId={course.id} initialData={{ title: course.title }} />
							<UpdateDescription courseId={course.id} initialData={{ description: course.description ?? '' }} />
							<UpdateImage courseId={course.id} initialData={{ image: course.image ?? '' }} />
						</div>

						<div className="space-y-6">
							<div>
								<div className="mb-2.5 flex items-center gap-x-2 sm:mb-4 md:mb-5">
									<IconBadge icon={TbListDetails} />
									<h2 className="text-xl">Course chapters</h2>
								</div>
							</div>

							<div>
								<div className="mb-2.5 flex items-center gap-x-2 sm:mb-4 md:mb-5">
									<IconBadge icon={TbPackage} />
									<h2 className="text-xl">Resources & Attachments</h2>
								</div>
							</div>
						</div>
					</PageSection>
				</PageContent>
			</PageWrapper>
		</HydrateClient>
	)
}
