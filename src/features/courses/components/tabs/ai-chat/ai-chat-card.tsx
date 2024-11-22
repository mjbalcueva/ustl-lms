'use client'

import { useEffect, useRef } from 'react'
import { useChat, type Message } from 'ai/react'
import { useSession } from 'next-auth/react'

import { CardFooter, CardHeader, CardTitle } from '@/core/components/compound-card'
import { Button } from '@/core/components/ui/button'
import { Card } from '@/core/components/ui/card'
import { ScrollArea, ScrollBar } from '@/core/components/ui/scroll-area'
import { Separator } from '@/core/components/ui/separator'
import { ArrowReset } from '@/core/lib/icons'

import { AiChatInput } from '@/features/courses/components/tabs/ai-chat/ai-chat-input'
import { AiChatMessage } from '@/features/courses/components/tabs/ai-chat/ai-chat-message'
import { AiChatTyping } from '@/features/courses/components/tabs/ai-chat/ai-chat-typing'

export default function AiChatCard() {
	const session = useSession()
	const user = session.data?.user

	const initialMessages: Message[] = [
		{
			id: '1',
			role: 'assistant',
			content:
				"Hi! I'm Daryll, your study buddy and academic genius—minus the coffee breaks! What would you like to learn about?",
			createdAt: new Date()
		}
	]

	const {
		messages: chatMessages,
		input,
		handleInputChange,
		handleSubmit,
		isLoading,
		reload,
		setMessages
	} = useChat({
		initialMessages,
		body: {
			userDetails: {
				name: user?.name ?? 'Alakazam',
				id: user?.id ?? ''
			}
		}
	})

	const hasStartedConversation = chatMessages.length > initialMessages.length

	const messagesEndRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [chatMessages])

	const handleReset = () => {
		setMessages(initialMessages)
		void reload()
	}

	return (
		<Card className={`flex flex-col ${hasStartedConversation ? 'h-[calc(100vh-12rem)]' : 'h-80'}`}>
			<CardHeader className="flex items-center justify-between">
				<CardTitle className="text-lg font-semibold">Course AI Assistant</CardTitle>
				{hasStartedConversation && (
					<Button
						variant="outline"
						size="sm"
						onClick={handleReset}
						title="Reset conversation"
						className="text-muted-foreground hover:text-foreground"
					>
						<ArrowReset className="size-4" />
						Reset conversation
					</Button>
				)}
			</CardHeader>

			<Separator className="flex-none" />

			<ScrollArea className="flex-1 overflow-y-auto px-4">
				<div className="space-y-2 py-4">
					{chatMessages.map((message) => (
						<AiChatMessage
							key={message.id}
							message={message}
							userData={{
								id: user?.id ?? '',
								imageUrl: user?.imageUrl ?? null,
								name: user?.name ?? null
							}}
						/>
					))}
					{isLoading && <AiChatTyping />}
					<div ref={messagesEndRef} />
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>

			<CardFooter className="flex-none pt-4">
				<AiChatInput
					input={input}
					handleInputChange={handleInputChange}
					handleSubmit={handleSubmit}
				/>
			</CardFooter>
		</Card>
	)
}
