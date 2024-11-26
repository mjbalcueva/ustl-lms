'use client'

import { type inferProcedureOutput } from '@trpc/server'
import { type Message } from 'ai'
import { useChat } from 'ai/react'
import { useSession } from 'next-auth/react'

import { type AppRouter } from '@/server/api/root'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/ui/tabs'

import { AiChatCard } from '@/features/chapters/components/tabs/ai-chat/ai-chat-card'

type ChapterTabsProps = {
	chapter: inferProcedureOutput<AppRouter['chapter']['findChapter']>['chapter']
}
export const ChapterTabs = ({ chapter }: ChapterTabsProps) => {
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
		initialMessages,
		body: {
			userDetails: {
				name: user?.name ?? 'Alakazam',
				id: user?.id ?? ''
			},
			course: chapter
		}
	})

	return (
		<Tabs defaultValue="ai-chat" className="flex flex-col items-end md:gap-3">
			<TabsList className="w-full justify-end rounded-xl">
				<TabsTrigger value="ai-chat" className="flex-1 rounded-lg">
					Chapter AI Assistant
				</TabsTrigger>
				<TabsTrigger value="forum" className="flex-1 rounded-lg">
					Forum
				</TabsTrigger>
			</TabsList>

			<TabsContent value="ai-chat" className="w-full rounded-xl">
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

			<TabsContent value="forum" className="w-full">
				{/* <ForumCard /> */}
				forum
			</TabsContent>
		</Tabs>
	)
}
