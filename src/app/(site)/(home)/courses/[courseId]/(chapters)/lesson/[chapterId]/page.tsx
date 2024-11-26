import { redirect } from 'next/navigation'
import MuxPlayer from '@mux/mux-player-react'

import { api } from '@/services/trpc/server'

import { NotFound } from '@/core/components/error-pages/not-found'
import { TiptapContentViewer } from '@/core/components/tiptap-editor/content-viewer'
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
import { CourseSingle, Instructor, Lesson } from '@/core/lib/icons'
import { formatDate } from '@/core/lib/utils/format-date'
import { type Breadcrumb } from '@/core/types/breadcrumbs'

import { ChapterAttachments } from '@/features/chapters/components/chapter-attachments'
import { ChapterProgress } from '@/features/chapters/components/chapter-progress'
import { ChapterTabs } from '@/features/chapters/components/tabs/chapter-tabs'
import { ToggleChapterCompletion } from '@/features/chapters/components/toggle-chapter-completion'

export default async function Page({
	params: { courseId, chapterId }
}: {
	params: {
		courseId: string
		chapterId: string
	}
}) {
	const { chapter } = await api.chapter.findChapter({ courseId, id: chapterId })

	if (!chapter) return <NotFound item="chapter" />
	if (chapter.type !== 'LESSON') {
		redirect(`/courses/${courseId}/${chapter.type.toLowerCase()}/${chapterId}`)
	}

	const isCompleted = chapter.chapterProgress?.[0]?.isCompleted

	const crumbs: Breadcrumb = [
		{ icon: Instructor },
		{ label: 'Courses', href: '/courses' },
		{ icon: CourseSingle, label: chapter.course.code, href: `/courses/${courseId}` },
		{
			icon: Lesson,
			label: chapter.title,
			href: `/courses/${courseId}/lesson/${chapterId}`
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
					label="This chapter is archived. It remains accessible to students who have previously accessed it but is hidden from new participants."
					variant="info"
				/>
			)}

			<PageContent className="mb-24 flex-wrap gap-4 space-y-6 px-4 md:mb-12 md:flex md:px-6">
				<PageSection className="flex-[3] gap-4 md:min-w-[500px]" columnMode>
					<div className="flex items-start justify-between pt-4 md:pt-6">
						<div className="flex flex-col">
							<PageTitle>{chapter.title}</PageTitle>
							<PageDescription>Last updated: {formatDate(chapter.updatedAt)}</PageDescription>
						</div>
						<ToggleChapterCompletion chapterId={chapterId} isCompleted={isCompleted} />
					</div>

					{chapter.videoUrl && (
						<MuxPlayer
							playbackId={chapter.muxData?.playbackId}
							accentColor="#737373"
							primaryColor="#fafafa"
							className="aspect-video overflow-hidden rounded-xl border border-input bg-card md:max-h-[32rem]"
							disableTracking
						/>
					)}

					<Card className="text-pretty p-6 text-sm tracking-wide">
						<TiptapContentViewer value={chapter.content} />
					</Card>
				</PageSection>

				<PageSection className="flex-1 md:min-w-[360px]" columnMode>
					<ChapterTabs chapter={chapter} />

					<ChapterAttachments attachments={chapter.attachments} />

					<ChapterProgress chapters={chapter} />
				</PageSection>
			</PageContent>
		</>
	)
}
