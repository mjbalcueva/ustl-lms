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

import { AssessmentActionButton } from '@/features/assessment/instructor/components/assessment-action-button'
import { AssessmentQuestions } from '@/features/assessment/instructor/components/assessment-questions'
import { EditAssessmentInstructionForm } from '@/features/assessment/instructor/components/forms/edit-assessment-instruction-form'
import { EditAssessmentTitleForm } from '@/features/assessment/instructor/components/forms/edit-assessment-title-form'

export default async function Page({
	params: { courseId, chapterId, assessmentId }
}: {
	params: { courseId: string; chapterId: string; assessmentId: string }
}) {
	const session = await auth()
	if (session?.user.role === 'STUDENT') {
		redirect(
			`/courses/${courseId}/assessment/${chapterId}/quesionts/${assessmentId}`
		)
	}

	const { assessment } = await api.instructor.assessment.findOneAssessment({
		assessmentId
	})
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
				<div className="min-h-[46.8px]">
					<PageTitle>Section Setup</PageTitle>
					<PageDescription>
						Configure questions, points and settings
					</PageDescription>
				</div>
				<AssessmentActionButton
					assessmentId={assessment.assessmentId}
					chapterId={assessment.chapter.chapterId}
					courseId={assessment.chapter.course.courseId}
					shuffleQuestions={assessment.shuffleQuestions}
					shuffleOptions={assessment.shuffleOptions}
				/>
			</PageHeader>

			<PageContent className="mb-24 space-y-6 px-2.5 sm:px-4 md:mb-12 md:flex md:flex-wrap md:gap-6 md:space-y-0 md:px-6">
				<PageSection columnMode>
					<FoldableBlock title="Customize your section" icon={LuFeather}>
						<EditAssessmentTitleForm
							assessmentId={assessmentId}
							title={assessment.title}
						/>

						<EditAssessmentInstructionForm
							assessmentId={assessmentId}
							instruction={assessment.instruction}
						/>
					</FoldableBlock>
				</PageSection>

				<PageSection columnMode>
					<FoldableBlock title="Your questions" icon={TbFlagQuestion}>
						<AssessmentQuestions
							assessmentId={assessmentId}
							courseId={assessment.chapter.course.courseId}
							questions={assessment.questions}
						/>
					</FoldableBlock>
				</PageSection>
			</PageContent>
		</>
	)
}
