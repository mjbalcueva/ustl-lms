import { useMemo } from 'react'
import { type Attachment, type Chapter, type Course, type MuxData } from '@prisma/client'

import { AddChapterAttachmentsForm } from '@/client/components/course/forms/add-chapter-attachments'
import { EditChapterContentForm } from '@/client/components/course/forms/edit-chapter-content'
import { EditChapterTitleForm } from '@/client/components/course/forms/edit-chapter-title'
import { EditChapterVideoForm } from '@/client/components/course/forms/edit-chapter-video'
import { CollapsibleSection } from '@/client/components/ui/collapsible-section'
import { PageContent, PageSection } from '@/client/components/ui/page'

type ChapterEditContentProps = {
	chapter: Chapter & { course: Course } & { attachments: Attachment[] } & { muxData: MuxData | null }
}

export const ChapterEditContent = ({ chapter }: ChapterEditContentProps) => {
	const renderChapterContent = useMemo(() => {
		switch (chapter.type) {
			case 'ASSESSMENT':
				return (
					<>
						<PageSection columnMode>
							<CollapsibleSection title="Customize your assessment" iconName="Tb/TbWriting">
								<EditChapterTitleForm id={chapter.id} courseId={chapter.course.id} title={chapter.title} />
								<EditChapterContentForm id={chapter.id} courseId={chapter.course.id} content={chapter.content} />
							</CollapsibleSection>

							<CollapsibleSection title="Learning materials" iconName="Tb/TbPaperclip">
								<AddChapterAttachmentsForm
									courseId={chapter.course.id}
									chapterId={chapter.id}
									attachments={chapter.attachments}
								/>
							</CollapsibleSection>
						</PageSection>

						<PageSection columnMode>
							<CollapsibleSection title="Outline" iconName="Lu/LuFeather">
								<div>Assessment Builder</div>
							</CollapsibleSection>

							<CollapsibleSection title="Student Feedback" iconName="Tb/TbMessage">
								<div>Comments from students</div>
							</CollapsibleSection>
						</PageSection>
					</>
				)
			case 'ASSIGNMENT':
				return (
					<>
						<PageSection columnMode>
							<CollapsibleSection title="Customize your assignment" iconName="Tb/TbClipboardList">
								<EditChapterTitleForm id={chapter.id} courseId={chapter.course.id} title={chapter.title} />
								<EditChapterContentForm id={chapter.id} courseId={chapter.course.id} content={chapter.content} />
							</CollapsibleSection>

							<CollapsibleSection title="Learning materials" iconName="Tb/TbPaperclip">
								<AddChapterAttachmentsForm
									courseId={chapter.course.id}
									chapterId={chapter.id}
									attachments={chapter.attachments}
								/>
							</CollapsibleSection>
						</PageSection>

						<PageSection columnMode>
							<CollapsibleSection title="Student submissions" iconName="Tb/TbSend">
								<div>Student submissions</div>
							</CollapsibleSection>

							<CollapsibleSection title="Student Feedback" iconName="Tb/TbMessage">
								<div>Comments from students</div>
							</CollapsibleSection>
						</PageSection>
					</>
				)
			case 'LESSON':
				return (
					<>
						<PageSection columnMode>
							<CollapsibleSection title="Customize your lesson" iconName="Tb/TbNotes">
								<EditChapterTitleForm id={chapter.id} courseId={chapter.course.id} title={chapter.title} />
								<EditChapterContentForm id={chapter.id} courseId={chapter.course.id} content={chapter.content} />
							</CollapsibleSection>

							<CollapsibleSection title="Learning materials" iconName="Tb/TbPaperclip">
								<AddChapterAttachmentsForm
									courseId={chapter.course.id}
									chapterId={chapter.id}
									attachments={chapter.attachments}
								/>
							</CollapsibleSection>
						</PageSection>

						<PageSection columnMode>
							<CollapsibleSection title="Lecture video" iconName="Tb/TbVideo">
								<EditChapterVideoForm id={chapter.id} courseId={chapter.course.id} initialData={chapter} />
							</CollapsibleSection>

							<CollapsibleSection title="Student Feedback" iconName="Tb/TbMessage">
								<div>Comments from students</div>
							</CollapsibleSection>
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
