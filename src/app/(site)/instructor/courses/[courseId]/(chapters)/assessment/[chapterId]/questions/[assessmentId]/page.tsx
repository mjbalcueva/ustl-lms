import { redirect } from 'next/navigation'
import { LuFeather } from 'react-icons/lu'
import { TbFlagQuestion } from 'react-icons/tb'

import { auth } from '@/services/authjs/auth'
import { api } from '@/services/trpc/server'

import { NotFound } from '@/core/components/error-pages/not-found'
import { FoldableBlock } from '@/core/components/foldable-block'
import {
	PageBreadcrumbs,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle
} from '@/core/components/ui/page'
import { Separator } from '@/core/components/ui/separator'
import { Assessment, CourseSingle, Instructor } from '@/core/lib/icons'
import { type Breadcrumb } from '@/core/types/breadcrumbs'

export default async function Page({
	params
}: {
	params: { courseId: string; chapterId: string; assessmentId: string }
}) {
	const { courseId, chapterId, assessmentId } = params
	const session = await auth()
	if (session?.user.role !== 'INSTRUCTOR') {
		redirect(`/courses/${courseId}/assessment/${chapterId}/quesionts/${assessmentId}`)
	}

	const { assessment } = await api.question.findAssessment({ chapterId, assessmentId })
	if (!assessment) return <NotFound item="assessment" />

	const crumbs: Breadcrumb = [
		{ icon: Instructor },
		{ label: 'Courses', href: '/instructor/courses' },
		{
			icon: CourseSingle,
			label: assessment.chapter.course.title,
			href: `/instructor/courses/${courseId}`
		},
		{
			icon: Assessment,
			label: assessment.chapter.title,
			href: `/instructor/courses/${courseId}/assessment/${chapterId}`
		},
		{
			label: assessment.title
		}
	]

	return (
		<>
			<PageHeader className="hidden space-y-0 md:block md:py-3">
				<PageBreadcrumbs crumbs={crumbs} />
			</PageHeader>

			<Separator className="hidden md:block" />

			<PageHeader className="flex flex-wrap items-center justify-between">
				<div>
					<PageTitle>Section Setup</PageTitle>
					<PageDescription>Configure questions, points and settings</PageDescription>
				</div>
			</PageHeader>

			<PageContent className="mb-24 space-y-6 px-2.5 sm:px-4 md:mb-12 md:flex md:flex-wrap md:gap-6 md:space-y-0 md:px-6">
				<PageSection columnMode>
					<FoldableBlock title="Customize your section" icon={LuFeather}>
						<h4>title</h4>
						<h4>instruction</h4>
					</FoldableBlock>
				</PageSection>

				<PageSection columnMode>
					<FoldableBlock title="Your questions" icon={TbFlagQuestion}>
						<h4>questions</h4>
					</FoldableBlock>
				</PageSection>
			</PageContent>
		</>
	)
}