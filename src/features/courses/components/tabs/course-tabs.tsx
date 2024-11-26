'use client'

import { type inferProcedureOutput } from '@trpc/server'
import { type Message } from 'ai'
import { useChat } from 'ai/react'
import { useSession } from 'next-auth/react'

import { type AppRouter } from '@/server/api/root'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/ui/tabs'

import { CourseAttachmentCard } from '@/features/courses/components/course-attachment-card'
import CourseChapterCard from '@/features/courses/components/course-chapter-card'
import { AiChatCard } from '@/features/courses/components/tabs/ai-chat/ai-chat-card'
import ForumCard from '@/features/courses/components/tabs/forum/forum-card'

type CourseTabsProps = {
	course: inferProcedureOutput<AppRouter['course']['findEnrolledCourseDetails']>['course']
}
export const CourseTabs = ({ course }: CourseTabsProps) => {
	const session = useSession()
	const user = session?.data?.user

	const initialMessages: Message[] = [
		{
			id: '1',
			role: 'assistant',
			content:
				"Hi! I'm Daryll, your study buddy and AI assistant! ☕ What would you like to learn about?",
			createdAt: new Date()
		}
	]

	const { messages, handleSubmit, input, handleInputChange, isLoading, setMessages } = useChat({
		api: '/api/ai/chat/course',
		initialMessages,
		body: {
			userDetails: {
				name: user?.name ?? 'Alakazam',
				id: user?.id ?? ''
			},
			course
		}
	})

	return (
		<Tabs defaultValue="syllabus" className="space-y-4">
			<TabsList>
				<TabsTrigger value="syllabus">Syllabus</TabsTrigger>
				<TabsTrigger value="ai-chat">AI Chat</TabsTrigger>
				<TabsTrigger value="forum">Forum</TabsTrigger>
				<TabsTrigger value="attachments">Resources</TabsTrigger>
			</TabsList>

			<TabsContent value="syllabus" className="space-y-3 rounded-lg">
				{course.chapters.map((chapter) => {
					return (
						<CourseChapterCard
							key={chapter.id}
							id={chapter.id}
							courseId={course.id}
							title={chapter.title}
							content={chapter.content ?? ''}
							type={chapter.type}
							createdAt={chapter.createdAt}
							isCompleted={chapter.chapterProgress?.[0]?.isCompleted ?? false}
						/>
					)
				})}
			</TabsContent>

			<TabsContent value="ai-chat" className="rounded-lg">
				<AiChatCard
					messages={messages}
					input={input}
					handleInputChange={handleInputChange}
					handleSubmit={handleSubmit}
					isLoading={isLoading}
					setMessages={setMessages}
					initialMessages={initialMessages}
					user={{
						id: user?.id ?? '',
						name: user?.name ?? '',
						imageUrl: user?.imageUrl ?? ''
					}}
				/>
			</TabsContent>

			<TabsContent value="forum" className="rounded-lg">
				<ForumCard />
			</TabsContent>

			<TabsContent value="attachments" className="space-y-3 rounded-lg">
				{course.attachments.map((attachment) => (
					<CourseAttachmentCard
						key={attachment.id}
						id={attachment.id}
						name={attachment.name}
						url={attachment.url}
						createdAt={attachment.createdAt}
					/>
				))}
			</TabsContent>
		</Tabs>
	)
}
