'use client'

import { useEffect, useRef } from 'react'
import { useChat, type Message } from 'ai/react'

import { CardFooter, CardHeader, CardTitle } from '@/core/components/compound-card'
import { Card } from '@/core/components/ui/card'
import { ScrollArea, ScrollBar } from '@/core/components/ui/scroll-area'
import { Separator } from '@/core/components/ui/separator'

import { AiChatInput } from '@/features/courses/components/tabs/ai-chat/ai-chat-input'
import { AiChatMessage } from '@/features/courses/components/tabs/ai-chat/ai-chat-message'

export default function AiChatCard() {
	const initialMessages: Message[] = [
		{
			id: '1',
			role: 'assistant',
			content:
				"Hi! I'm Daryll, your study buddy and academic genius—minus the coffee breaks! What would you like to learn about?"
		}
	]

	const {
		messages: chatMessages,
		input,
		handleInputChange,
		handleSubmit
	} = useChat({
		initialMessages
	})

	const messagesEndRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [chatMessages])

	return (
		<Card className="flex h-[calc(100vh-8rem)] flex-col">
			<CardHeader className="flex-none">
				<CardTitle className="text-lg font-semibold">Course AI Assistant</CardTitle>
			</CardHeader>

			<Separator className="flex-none" />

			<ScrollArea className="flex-1 overflow-y-auto px-4">
				<div className="space-y-2 py-4">
					{chatMessages.map((message) => (
						<AiChatMessage key={message.id} message={message} />
					))}
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
