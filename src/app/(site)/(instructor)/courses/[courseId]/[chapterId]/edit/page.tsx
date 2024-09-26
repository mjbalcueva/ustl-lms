import { TbListDetails, TbNotes, TbPackage } from 'react-icons/tb'

import { api } from '@/shared/trpc/server'
import { type Breadcrumb } from '@/shared/types/breadcrumbs'

import { EditChapterContentForm } from '@/client/components/course/forms/edit-chapter-content'
import { EditChapterTitleForm } from '@/client/components/course/forms/edit-chapter-title'
import { NotFound } from '@/client/components/not-found'
import {
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

export default async function Page({ params }: { params: { courseId: string; chapterId: string } }) {
	const { chapter } = await api.chapter.getChapter({ courseId: params.courseId, id: params.chapterId })

	if (!chapter) return <NotFound item="chapter" />

	const requiredFields = [chapter.title, chapter.content, chapter.videoUrl]

	const totalFields = requiredFields.length
	const completedFields = requiredFields.filter(Boolean).length

	const completionText = `(${completedFields}/${totalFields})`

	const crumbs: Breadcrumb = [
		{ icon: 'instructor' },
		{ label: 'Courses', href: '/courses/manage' },
		{ icon: 'course', label: chapter.course.title, href: `/courses/${chapter.course.id}/edit` },
		{ icon: 'chapter', label: chapter.title, href: `/courses/${chapter.course.id}/${chapter.id}/edit` },
		{ label: 'Edit' }
	]

	return (
		<PageWrapper>
			<PageHeader className="hidden space-y-0 md:block md:py-3">
				<PageBreadcrumbs crumbs={crumbs} />
			</PageHeader>

			<Separator className="hidden md:block" />

			<PageHeader>
				<PageTitle>Chapter</PageTitle>
				<PageDescription>Completed {completionText}</PageDescription>
			</PageHeader>

			<PageContent className="gap-4 px-2.5 sm:px-4 md:flex md:flex-wrap md:gap-6 md:px-6">
				<PageSection className="mb-6 flex-1 md:mb-0" compactMode>
					<PageSectionTitle title="Customize your chapter" icon={TbNotes} />
					<EditChapterTitleForm id={chapter.id} courseId={chapter.course.id} title={chapter.title} />
					<EditChapterContentForm id={chapter.id} courseId={chapter.course.id} content={chapter.content} />
				</PageSection>

				<div className="flex flex-1 flex-col gap-4 md:gap-6">
					<PageSection compactMode>
						<PageSectionTitle title="Access settings" icon={TbListDetails} />
					</PageSection>

					<PageSection compactMode>
						<PageSectionTitle title="Add content" icon={TbPackage} />
					</PageSection>
				</div>
			</PageContent>
		</PageWrapper>
	)
}
