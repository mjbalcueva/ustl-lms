'use client'

import { type inferProcedureOutput } from '@trpc/server'
import { type Message } from 'ai'
import { useChat } from 'ai/react'
import { useSession } from 'next-auth/react'

import { type AppRouter } from '@/server/api/root'

import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from '@/core/components/ui/tabs'

import { AttachmentCard } from '@/features/courses/student/components/attachments/attachment-card'
import { ChapterCard } from '@/features/courses/student/components/chapters/chapter-card'
import { AiChatCard } from '@/features/courses/student/components/chatbot/ai-chat-card'
import { ForumCard } from '@/features/courses/student/components/forum/forum-card'

export const EnrolledCourseTabs = ({
	course
}: {
	course: inferProcedureOutput<
		AppRouter['student']['course']['findEnrolledCourse']
	>['course']
}) => {
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

	const {
		messages,
		handleSubmit,
		input,
		handleInputChange,
		isLoading,
		setMessages
	} = useChat({
		api: '/api/chat/course',
		initialMessages,
		body: {
			userDetails: {
				name: user?.name ?? '',
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
				{course.chapters?.map((chapter) => (
					<ChapterCard key={chapter.chapterId} chapter={chapter} />
				))}
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
				{course.attachments?.map((attachment) => (
					<AttachmentCard
						key={attachment.attachmentId}
						id={attachment.attachmentId}
						name={attachment.name}
						url={attachment.url}
						createdAt={attachment.createdAt}
					/>
				))}
			</TabsContent>
		</Tabs>
	)
}
