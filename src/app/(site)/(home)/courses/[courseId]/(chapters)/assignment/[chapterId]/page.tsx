import { redirect } from 'next/navigation'

import { api } from '@/services/trpc/server'

import { NotFound } from '@/core/components/error-pages/not-found'
import { ContentViewer } from '@/core/components/tiptap-editor/content-viewer'
import { Banner } from '@/core/components/ui/banner'
import { Card } from '@/core/components/ui/card'
import {
	PageBreadcrumbs,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageTitle
} from '@/core/components/ui/page'
import { Separator } from '@/core/components/ui/separator'
import { Assignment, CourseSingle, Instructor } from '@/core/lib/icons'
import { formatDate } from '@/core/lib/utils/format-date'
import { type Breadcrumb } from '@/core/types/breadcrumbs'

import { AssignmentSubmission } from '@/features/chapters/student/components/assignment/assignment-submission'
import { AttachmentCard } from '@/features/chapters/student/components/attachments/attachment-card'
import { ChapterProgress } from '@/features/chapters/student/components/chapter-progress'
import { ChapterTabs } from '@/features/chapters/student/components/chapter-tabs'
import { EditChapterCompletionForm } from '@/features/chapters/student/components/forms/edit-chapter-completion-form'

export default async function Page({
	params: { courseId, chapterId }
}: {
	params: {
		courseId: string
		chapterId: string
	}
}) {
	const { chapter } = await api.student.chapter.findOneChapter({ chapterId })

	if (!chapter) return <NotFound item="chapter" />
	if (chapter.type !== 'ASSIGNMENT') {
		redirect(`/courses/${courseId}/${chapter.type.toLowerCase()}/${chapterId}`)
	}

	const crumbs: Breadcrumb = [
		{ icon: Instructor },
		{ label: 'Courses', href: '/courses' },
		{
			icon: CourseSingle,
			label: chapter.course.code,
			href: `/courses/${courseId}`
		},
		{
			icon: Assignment,
			label: chapter.title,
			href: `/courses/${courseId}/assignment/${chapterId}`
		}
	]

	return (
		<>
			<PageHeader className="hidden space-y-0 md:block md:py-3">
				<PageBreadcrumbs crumbs={crumbs} />
			</PageHeader>

			<Separator className="hidden md:block" />

			{chapter.status !== 'PUBLISHED' && (
				<Banner
					label="This content is currently archived but still available for you to access since you were previously enrolled."
					variant="info"
				/>
			)}

			<PageContent className="mb-24 flex-wrap gap-4 space-y-6 px-4 md:mb-12 md:flex md:px-6">
				<PageSection className="flex-[3] gap-4 md:min-w-[500px]" columnMode>
					<div className="flex items-start justify-between pt-4 md:pt-6">
						<div className="flex flex-col">
							<PageTitle>{chapter.title}</PageTitle>
							<PageDescription>
								Last updated: {formatDate(chapter.updatedAt)}
							</PageDescription>
						</div>
						<EditChapterCompletionForm chapter={chapter} />
					</div>

					<Card className="text-pretty p-6 text-sm tracking-wide">
						<ContentViewer value={chapter.content} />
					</Card>

					<AssignmentSubmission
						chapterId={chapter.chapterId}
						submission={chapter.submission}
					/>
				</PageSection>

				<PageSection className="flex-1 md:min-w-[360px]" columnMode>
					<ChapterTabs chapter={chapter} />

					<AttachmentCard attachments={chapter.attachments} />

					<ChapterProgress chapters={chapter} />
				</PageSection>
			</PageContent>
		</>
	)
}
