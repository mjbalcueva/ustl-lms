import { LuFile, LuLayoutDashboard, LuListChecks } from 'react-icons/lu'

import { api, HydrateClient } from '@/shared/trpc/server'

import { IconBadge } from '@/client/components/icon-badge'
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

	const requiredFields = [
		course?.code,
		course?.title,
		course?.description,
		course?.image,
		course?.categoryId,
		course?.isPublished
	]

	const totalFields = requiredFields.length
	const completedFields = requiredFields.filter(Boolean).length
	const completionText = `(${completedFields}/${totalFields})`

	const crumbs: Crumb[] = [
		{ icon: 'instructor' },
		{ label: 'Courses', href: '/courses' },
		{ label: 'Edit' },
		{ icon: 'draftCourse', label: course?.title }
	]

	return (
		<HydrateClient>
			<PageWrapper>
				<PageHeader className="space-y-0 md:py-3">
					<Breadcrumbs crumbs={crumbs} />
				</PageHeader>

				<Separator />

				<PageHeader>
					<PageTitle className="font-bold">Course Setup</PageTitle>
					<PageDescription>Completed {completionText}</PageDescription>
				</PageHeader>

				<PageContent>
					<PageSection>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div>
								<div className="flex items-center gap-x-2">
									<IconBadge icon={LuLayoutDashboard} />
									<h2 className="text-xl">Customize your course</h2>
								</div>
							</div>
							<div className="space-y-6">
								<div>
									<div className="flex items-center gap-x-2">
										<IconBadge icon={LuListChecks} />
										<h2 className="text-xl">Course chapters</h2>
									</div>
								</div>
								<div>
									<div className="flex items-center gap-x-2">
										<IconBadge icon={LuFile} />
										<h2 className="text-xl">Resources & Attachments</h2>
									</div>
								</div>
							</div>
						</div>
					</PageSection>
				</PageContent>
			</PageWrapper>
		</HydrateClient>
	)
}
