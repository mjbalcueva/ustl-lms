import { redirect } from 'next/navigation'

import { api } from '@/shared/trpc/server'
import { type Breadcrumb } from '@/shared/types/breadcrumbs'

import { ChapterEditContent } from '@/client/components/course/chapter-edit-content'
import { ChapterActions } from '@/client/components/course/forms/chapter-actions'
import { NotFound } from '@/client/components/not-found'
import { Badge } from '@/client/components/ui/badge'
import { Banner } from '@/client/components/ui/banner'
import { type Icons } from '@/client/components/ui/icons'
import { PageBreadcrumbs, PageDescription, PageHeader, PageTitle, PageWrapper } from '@/client/components/ui/page'
import { Separator } from '@/client/components/ui/separator'
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
				<ChapterActions id={chapter.id} courseId={chapter.course.id} status={chapter.status} type={chapter.type} />
			</PageHeader>

			<ChapterEditContent chapter={chapter} />
		</PageWrapper>
	)
}
