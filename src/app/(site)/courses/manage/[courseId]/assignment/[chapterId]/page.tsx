import { redirect } from 'next/navigation'
import { TbClipboardList, TbMessage, TbPaperclip, TbSend } from 'react-icons/tb'

import { auth } from '@/services/authjs/auth'
import { api } from '@/services/trpc/server'

import { NotFound } from '@/core/components/error-pages/not-found'
import { FoldableBlock } from '@/core/components/foldable-block'
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
import { Separator } from '@/core/components/ui/separator'
import { Assignment, CourseSingle, Instructor } from '@/core/lib/icons'
import { capitalize } from '@/core/lib/utils/capitalize'
import { type Breadcrumb } from '@/core/types/breadcrumbs'

import { ChapterActions } from '@/features/chapters/components/chapter-action-button'
import { AddChapterAttachmentsForm } from '@/features/chapters/components/forms/add-chapter-attachments-form'
import { EditChapterContentForm } from '@/features/chapters/components/forms/edit-chapter-content-form'
import { EditChapterTitleForm } from '@/features/chapters/components/forms/edit-chapter-title-form'

export default async function Page({
	params
}: {
	params: { courseId: string; chapterId: string }
}) {
	const session = await auth()
	const isInstructor = session?.user.role === 'INSTRUCTOR'

	const { chapter } = await api.chapter.findChapter({
		courseId: params.courseId,
		id: params.chapterId
	})

	if (!chapter) return <NotFound item="chapter" />
	if (!isInstructor) {
		redirect(`/courses/${params.courseId}/assignment/${params.chapterId}`)
	}
	if (chapter.type != 'ASSIGNMENT') {
		redirect(`/courses/manage/${chapter.course.id}/${chapter.type.toLowerCase()}/${chapter.id}`)
	}

	const requiredFields = [chapter.title, chapter.content, chapter.videoUrl, chapter.attachments]
	const totalFields = requiredFields.length
	const completedFields = requiredFields.filter(Boolean).length
	const completionText = `(${completedFields}/${totalFields})`

	const crumbs: Breadcrumb = [
		{ icon: Instructor },
		{ label: 'Courses', href: '/courses' },
		{ label: 'Manage', href: '/courses/manage' },
		{
			icon: CourseSingle,
			label: chapter.course.title,
			href: `/courses/manage/${chapter.course.id}`
		},
		{
			icon: Assignment,
			label: chapter.title,
			href: `/courses/manage/${chapter.course.id}/${chapter.type}/${chapter.id}`
		},
		{ label: 'Edit' }
	]

	return (
		<>
			<PageHeader className="hidden space-y-0 md:block md:py-3">
				<PageBreadcrumbs crumbs={crumbs} />
			</PageHeader>

			<Separator className="hidden md:block" />

			{chapter.status !== 'PUBLISHED' && (
				<Banner
					label={
						chapter.status === 'DRAFT'
							? 'This chapter is not published. It will not be visible to students.'
							: 'This chapter is archived. It remains accessible to students who have previously accessed it but is hidden from new participants.'
					}
					variant={chapter.status === 'DRAFT' ? 'warning' : 'info'}
				/>
			)}

			<PageHeader className="flex flex-wrap items-center justify-between">
				<div>
					<PageTitle>
						{capitalize(chapter.type)} Setup
						<Badge variant="outline" className="ml-2">
							{chapter.status}
						</Badge>
					</PageTitle>
					<PageDescription>Filled {completionText}</PageDescription>
				</div>
				<ChapterActions
					id={chapter.id}
					courseId={chapter.course.id}
					status={chapter.status}
					type={chapter.type}
				/>
			</PageHeader>

			<PageContent className="mb-24 space-y-6 px-2.5 sm:px-4 md:mb-12 md:flex md:flex-wrap md:gap-6 md:space-y-0 md:px-6">
				<PageSection columnMode>
					<FoldableBlock title="Customize your assignment" icon={TbClipboardList}>
						<EditChapterTitleForm
							id={chapter.id}
							courseId={chapter.course.id}
							title={chapter.title}
						/>
						<EditChapterContentForm
							id={chapter.id}
							courseId={chapter.course.id}
							content={chapter.content}
						/>
					</FoldableBlock>

					<FoldableBlock title="Learning materials" icon={TbPaperclip}>
						<AddChapterAttachmentsForm
							courseId={chapter.course.id}
							chapterId={chapter.id}
							attachments={chapter.attachments}
						/>
					</FoldableBlock>
				</PageSection>

				<PageSection columnMode>
					<FoldableBlock title="Student submissions" icon={TbSend}>
						<div>Student submissions</div>
					</FoldableBlock>

					<FoldableBlock title="Student Feedback" icon={TbMessage}>
						<div>Comments from students</div>
					</FoldableBlock>
				</PageSection>
			</PageContent>
		</>
	)
}
