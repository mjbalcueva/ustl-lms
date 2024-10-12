import { redirect } from 'next/navigation'
import { TbNotes, TbPaperclip, TbVideo } from 'react-icons/tb'

import { api } from '@/shared/trpc/server'
import { type Breadcrumb } from '@/shared/types/breadcrumbs'

import { AddChapterAttachmentsForm } from '@/client/components/course/forms/add-chapter-attachments'
import { ChapterActions } from '@/client/components/course/forms/chapter-actions'
import { EditChapterContentForm } from '@/client/components/course/forms/edit-chapter-content'
import { EditChapterTitleForm } from '@/client/components/course/forms/edit-chapter-title'
import { EditChapterVideoForm } from '@/client/components/course/forms/edit-chapter-video'
import { type Icons } from '@/client/components/icons'
import { NotFound } from '@/client/components/not-found'
import {
	Banner,
	PageBreadcrumbs,
	PageContent,
	PageDescription,
	PageHeader,
	PageSection,
	PageSectionTitle,
	PageTitle,
	PageWrapper,
	Separator
} from '@/client/components/ui'
import { capitalize } from '@/client/lib/utils'

export default async function Page({ params }: { params: { courseId: string; chapterId: string } }) {
	const session = await api.session.getSession()
	if (session?.user?.role !== 'INSTRUCTOR') redirect('/dashboard')

	const { chapter } = await api.chapter.getChapter({ courseId: params.courseId, id: params.chapterId })

	if (!chapter) return <NotFound item="chapter" />

	const requiredFields = [chapter.title, chapter.content, chapter.videoUrl, chapter.attachments]

	const totalFields = requiredFields.length
	const completedFields = requiredFields.filter(Boolean).length

	const completionText = `(${completedFields}/${totalFields})`

	const crumbs: Breadcrumb = [
		{ icon: 'instructor' },
		{ label: 'Courses', href: '/courses/manage' },
		{ icon: 'course', label: chapter.course.title, href: `/courses/${chapter.course.id}/edit` },
		{
			icon: chapter.type as keyof typeof Icons,
			label: chapter.title,
			href: `/courses/${chapter.course.id}/${chapter.id}/edit`
		},
		{ label: 'Edit' }
	]

	return (
		<PageWrapper>
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

			<PageHeader className="flex items-center justify-between space-y-0">
				<div className="space-y-2">
					<PageTitle>{capitalize(chapter.type)} Setup</PageTitle>
					<PageDescription>Filled {completionText}</PageDescription>
				</div>
				<ChapterActions
					id={chapter.id}
					courseId={chapter.course.id}
					status={chapter.status}
					chapterType={chapter.type}
				/>
			</PageHeader>

			<PageContent className="gap-4 px-2.5 sm:px-4 md:flex md:flex-wrap md:gap-6 md:px-6">
				<PageSection className="mb-6 flex-1 md:mb-0" compactMode>
					<PageSectionTitle title="Customize your topic" icon={TbNotes} />
					<EditChapterTitleForm id={chapter.id} courseId={chapter.course.id} title={chapter.title} />
					<EditChapterContentForm id={chapter.id} courseId={chapter.course.id} content={chapter.content} />
				</PageSection>

				<div className="flex flex-1 flex-col gap-4 md:gap-6">
					<PageSection compactMode>
						<PageSectionTitle title="Add a video" icon={TbVideo} />
						<EditChapterVideoForm id={chapter.id} courseId={chapter.course.id} initialData={chapter} />
					</PageSection>

					<PageSection compactMode>
						<PageSectionTitle title="Add learning materials" icon={TbPaperclip} />
						<AddChapterAttachmentsForm
							courseId={chapter.course.id}
							chapterId={chapter.id}
							attachments={chapter.attachments}
						/>
					</PageSection>
				</div>
			</PageContent>
		</PageWrapper>
	)
}
