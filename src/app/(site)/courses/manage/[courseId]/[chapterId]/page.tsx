import { redirect } from 'next/navigation'

import { api } from '@/services/trpc/server'

import { NotFound } from '@/core/components/error-pages/not-found'
import { Badge } from '@/core/components/ui/badge'
import { Banner } from '@/core/components/ui/banner'
import { PageBreadcrumbs, PageDescription, PageHeader, PageTitle } from '@/core/components/ui/page'
import { Separator } from '@/core/components/ui/separator'
import { Assessment, Assignment, CourseSingle, Instructor, Lesson } from '@/core/lib/icons'
import { capitalize } from '@/core/lib/utils/capitalize'
import { type Breadcrumb } from '@/core/types/breadcrumbs'

import { ChapterActions } from '@/features/chapters/components/chapter-action-button'
import { ChapterEditContent } from '@/features/chapters/components/edit-chapter-content'

export default async function Page({
	params
}: {
	params: { courseId: string; chapterId: string }
}) {
	const session = await api.session.getSession()
	if (session?.user?.role !== 'INSTRUCTOR') redirect('/dashboard')

	const { chapter } = await api.chapter.findChapter({
		courseId: params.courseId,
		id: params.chapterId
	})

	if (!chapter) return <NotFound item="chapter" />

	const requiredFields = [chapter.title, chapter.content, chapter.videoUrl, chapter.attachments]
	const totalFields = requiredFields.length
	const completedFields = requiredFields.filter(Boolean).length
	const completionText = `(${completedFields}/${totalFields})`

	const chapterTypeIconMap = {
		LESSON: Lesson,
		ASSIGNMENT: Assignment,
		ASSESSMENT: Assessment
	}

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
			icon: chapterTypeIconMap[chapter.type],
			label: chapter.title,
			href: `/courses/manage/${chapter.course.id}/${chapter.id}`
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

			<ChapterEditContent chapter={chapter} />
		</>
	)
}
