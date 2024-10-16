'use client'

import * as React from 'react'
import { type Attachment, type Chapter, type Course, type MuxData } from '@prisma/client'

import { CollapsibleSection } from '@/client/components/collapsible-section'
import { AddChapterAttachmentsForm } from '@/client/components/course/forms/add-chapter-attachments'
import { EditChapterContentForm } from '@/client/components/course/forms/edit-chapter-content'
import { EditChapterTitleForm } from '@/client/components/course/forms/edit-chapter-title'
import { EditChapterVideoForm } from '@/client/components/course/forms/edit-chapter-video'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/client/components/ui/tabs'

type ChapterTabsProps = {
	chapter: Chapter & { course: Course } & { attachments: Attachment[] } & { muxData: MuxData | null }
}
export const ChapterTabs = ({ chapter }: ChapterTabsProps) => {
	const [activeTab, setActiveTab] = React.useState('customize')

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 px-2.5 sm:px-4 md:space-y-4 md:px-6">
			<TabsList>
				<TabsTrigger value="customize">Customize</TabsTrigger>
				<TabsTrigger value="forum">Forum</TabsTrigger>
				<TabsTrigger value="submissions">Submissions</TabsTrigger>
			</TabsList>

			<TabsContent value="customize" className="gap-4 md:flex md:flex-wrap md:gap-6">
				<CollapsibleSection
					title={`Customize your ${chapter.type.toLowerCase()}`}
					iconName="Tb/TbNotes"
					className="mb-6 flex-1 md:mb-0"
				>
					<EditChapterTitleForm id={chapter.id} courseId={chapter.course.id} title={chapter.title} />
					<EditChapterContentForm id={chapter.id} courseId={chapter.course.id} content={chapter.content} />
				</CollapsibleSection>

				<div className="flex flex-1 flex-col gap-4 md:gap-6">
					<CollapsibleSection title="Lecture video" iconName="Tb/TbVideo">
						<EditChapterVideoForm id={chapter.id} courseId={chapter.course.id} initialData={chapter} />
					</CollapsibleSection>

					<CollapsibleSection title="Learning materials" iconName="Tb/TbPaperclip">
						<AddChapterAttachmentsForm
							courseId={chapter.course.id}
							chapterId={chapter.id}
							attachments={chapter.attachments}
						/>
					</CollapsibleSection>
				</div>
			</TabsContent>
		</Tabs>
	)
}
