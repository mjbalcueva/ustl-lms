import { useMemo } from 'react'
import { type Attachment, type Chapter, type Course, type MuxData } from '@prisma/client'
import { LuFeather } from 'react-icons/lu'
import {
	TbClipboardList,
	TbMessage,
	TbNotes,
	TbPaperclip,
	TbSend,
	TbVideo,
	TbWriting
} from 'react-icons/tb'

import { FoldableBlock } from '@/core/components/foldable-block'
import { PageContent, PageSection } from '@/core/components/ui/page'

import { AddChapterAttachmentsForm } from '@/features/chapters/components/forms/add-chapter-attachments-form'
import { EditChapterContentForm } from '@/features/chapters/components/forms/edit-chapter-content-form'
import { EditChapterTitleForm } from '@/features/chapters/components/forms/edit-chapter-title-form'
import { EditChapterVideoForm } from '@/features/chapters/components/forms/edit-chapter-video-form'

type ChapterEditContentProps = {
	chapter: Chapter & { course: Course } & { attachments: Attachment[] } & {
		muxData: MuxData | null
	}
}

export const ChapterEditContent = ({ chapter }: ChapterEditContentProps) => {
	const renderChapterContent = useMemo(() => {
		switch (chapter.type) {
			case 'ASSESSMENT':
				return (
					<>
						<PageSection columnMode>
							<FoldableBlock title="Customize your assessment" icon={TbWriting}>
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
							<FoldableBlock title="Outline" icon={LuFeather}>
								<div>Assessment Builder</div>
							</FoldableBlock>

							<FoldableBlock title="Student Feedback" icon={TbMessage}>
								<div>Comments from students</div>
							</FoldableBlock>
						</PageSection>
					</>
				)
			case 'ASSIGNMENT':
				return (
					<>
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
					</>
				)
			case 'LESSON':
				return (
					<>
						<PageSection columnMode>
							<FoldableBlock title="Customize your lesson" icon={TbNotes}>
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
							<FoldableBlock title="Lecture video" icon={TbVideo}>
								<EditChapterVideoForm
									id={chapter.id}
									courseId={chapter.course.id}
									initialData={chapter}
								/>
							</FoldableBlock>

							<FoldableBlock title="Student Feedback" icon={TbMessage}>
								<div>Comments from students</div>
							</FoldableBlock>
						</PageSection>
					</>
				)
			default:
				return null
		}
	}, [chapter])

	return (
		<PageContent className="mb-24 space-y-6 px-2.5 sm:px-4 md:mb-12 md:flex md:flex-wrap md:gap-6 md:space-y-0 md:px-6">
			{renderChapterContent}
		</PageContent>
	)
}
