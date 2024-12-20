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

import { ChapterActions } from '@/features/chapters/instructor/components/chapter-action-button'
import { AddChapterAttachmentsForm } from '@/features/chapters/instructor/components/forms/add-chapter-attachments-form'
import { EditChapterContentForm } from '@/features/chapters/instructor/components/forms/edit-chapter-content-form'
import { EditChapterTitleForm } from '@/features/chapters/instructor/components/forms/edit-chapter-title-form'

export default async function Page({
	params: { courseId, chapterId }
}: {
	params: { courseId: string; chapterId: string }
}) {
	const session = await auth()
	if (session?.user.role === 'STUDENT')
		redirect(`/courses/${courseId}/assignment/${chapterId}`)

	const { chapter } = await api.instructor.chapter.findOneChapter({
		chapterId
	})
	if (!chapter) return <NotFound item="chapter" />
	if (chapter.type !== 'ASSIGNMENT') {
		redirect(
			`/instructor/courses/${courseId}/${chapter.type.toLowerCase()}/${chapterId}`
		)
	}

	const requiredFields = [
		chapter.title,
		chapter.content,
		chapter.videoUrl,
		chapter.attachments
	]
	const completionText = `(${requiredFields.filter(Boolean).length}/${requiredFields.length})`

	const crumbs: Breadcrumb = [
		{ icon: Instructor },
		{ label: 'Courses', href: '/instructor/courses' },
		{
			icon: CourseSingle,
			label: chapter.course.title,
			href: `/instructor/courses/${courseId}`
		},
		{
			icon: Assignment,
			label: chapter.title,
			href: `/instructor/courses/${courseId}/assignment/${chapterId}`
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
					chapterId={chapter.chapterId}
					courseId={chapter.courseId}
					status={chapter.status}
					type={chapter.type}
				/>
			</PageHeader>

			<PageContent className="mb-24 space-y-6 px-2.5 sm:px-4 md:mb-12 md:flex md:flex-wrap md:gap-6 md:space-y-0 md:px-6">
				<PageSection columnMode>
					<FoldableBlock
						title="Customize your assignment"
						icon={TbClipboardList}
					>
						<EditChapterTitleForm
							chapterId={chapter.chapterId}
							title={chapter.title}
						/>
						<EditChapterContentForm
							chapterId={chapter.chapterId}
							content={chapter.content}
						/>
					</FoldableBlock>

					<FoldableBlock title="Learning materials" icon={TbPaperclip}>
						<AddChapterAttachmentsForm
							chapterId={chapter.chapterId}
							attachments={chapter.attachments}
						/>
					</FoldableBlock>
				</PageSection>

				<PageSection columnMode>
					<FoldableBlock
						title="Student submissions"
						icon={TbSend}
						defaultOpen={false}
					>
						<div>Student submissions</div>
					</FoldableBlock>

					<FoldableBlock
						title="Student Feedback"
						icon={TbMessage}
						defaultOpen={false}
					>
						<div>Comments from students</div>
					</FoldableBlock>
				</PageSection>
			</PageContent>
		</>
	)
}
