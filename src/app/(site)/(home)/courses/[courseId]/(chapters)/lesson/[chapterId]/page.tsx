import { redirect } from 'next/navigation'
import MuxPlayer from '@mux/mux-player-react'

import { api } from '@/services/trpc/server'

import { NotFound } from '@/core/components/error-pages/not-found'
import { TiptapContentViewer } from '@/core/components/tiptap-editor/content-viewer'
import { Banner } from '@/core/components/ui/banner'
import { Button } from '@/core/components/ui/button'
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
import { Check, CheckCircle, CourseSingle, Instructor, Lesson, Video } from '@/core/lib/icons'
import { formatDate } from '@/core/lib/utils/format-date'
import { type Breadcrumb } from '@/core/types/breadcrumbs'

import { ChapterTabs } from '@/features/chapters/components/tabs/chapter-tabs'

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

	// const { data: courseProgress, isLoading: isLoadingProgress } =
	// 	api.course.getCourseProgress.useQuery({
	// 		courseId: params.courseId
	// 	})

	// const { mutate: markAsComplete } = api.chapter.markAsComplete.useMutation({
	// 	onSuccess: () => {
	// 		setIsChapterDone(true)
	// 	}
	// })

	// const handleMarkAsDone = () => {
	// 	markAsComplete({
	// 		chapterId: params.chapterId,
	// 		courseId: params.courseId
	// 	})
	// }

	// if (isLoadingChapter || isLoadingProgress || !chapterData || !courseProgress) {
	// 	return <div>Loading...</div>
	// }

	// 				{/* Right Column */}
	// 				<div className="space-y-4">
	// 					<ChapterDiscussion
	// 						aiMessages={chapterData.aiMessages}
	// 						forumMessages={chapterData.forumMessages}
	// 						onSendAiMessage={(message) => {
	// 							// Implement AI message sending
	// 							console.log('Sending AI message:', message)
	// 						}}
	// 						onSendForumMessage={(message) => {
	// 							// Implement forum message sending
	// 							console.log('Sending forum message:', message)
	// 						}}
	// 					/>

	// 					<ChapterResources
	// 						resources={chapterData.resources}
	// 						onShare={(resourceId) => {
	// 							// Implement resource sharing
	// 							console.log('Sharing resource:', resourceId)
	// 						}}
	// 					/>

	// 					<ChapterProgress
	// 						chapters={courseProgress.chapters}
	// 						currentChapterId={params.chapterId}
	// 						completedChapterIds={courseProgress.completedChapterIds}
	// 					/>
	// 				</div>
	// 			</div>
	// 		</div>
	// 	</div>
	// )

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
						<Button disabled={isCompleted}>
							{isCompleted && (
								<>
									<CheckCircle className="!size-5" /> Completed
								</>
							)}
							{!isCompleted && (
								<>
									<Check className="!size-5" /> Mark as Done
								</>
							)}
						</Button>
					</div>

					{chapter.videoUrl ? (
						<MuxPlayer
							playbackId={chapter.muxData?.playbackId}
							accentColor="#737373"
							primaryColor="#fafafa"
							className="aspect-video overflow-hidden rounded-xl border border-input bg-card md:max-h-[32rem]"
							disableTracking
						/>
					) : (
						<div className="flex h-[11.5rem] items-center justify-center rounded-xl border border-input bg-card dark:bg-background">
							<Video className="size-10 text-card-foreground dark:text-muted-foreground" />
						</div>
					)}

					<Card className="text-pretty p-6 text-sm tracking-wide">
						<TiptapContentViewer value={chapter.content} />
					</Card>
				</PageSection>

				<PageSection className="flex-1 md:min-w-[360px]" columnMode>
					<ChapterTabs chapter={chapter} />
				</PageSection>
			</PageContent>
		</>
	)
}
