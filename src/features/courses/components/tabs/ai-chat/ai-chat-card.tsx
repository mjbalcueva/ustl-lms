'use client'

import { useState } from 'react'

import { CardHeader, CardTitle } from '@/core/components/compound-card'
import { Card } from '@/core/components/ui/card'

import { AiChatInput } from '@/features/courses/components/tabs/ai-chat/ai-chat-input'
import { AiChatMessages } from '@/features/courses/components/tabs/ai-chat/ai-chat-messages'

type Message = {
	id: string
	content: string
	sender: 'user' | 'ai'
	timestamp: string
}

export default function AiChatCard() {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: '1',
			content: "Hello! I'm your AI learning assistant. How can I help you today?",
			sender: 'ai',
			timestamp: new Date().toLocaleString()
		}
	])

	const handleSendMessage = (content: string) => {
		const newMessage = {
			id: Date.now().toString(),
			content,
			sender: 'user' as const,
			timestamp: new Date().toLocaleString()
		}
		setMessages([...messages, newMessage])
		// TODO: Implement AI response logic
	}

	return (
		<Card className="flex flex-col">
			<CardHeader>
				<CardTitle>AI Learning Assistant</CardTitle>
			</CardHeader>
			<div className="flex-1 overflow-y-auto px-4">
				<AiChatMessages messages={messages} />
			</div>
			<div className="border-t p-4">
				<AiChatInput onSendMessage={handleSendMessage} />
			</div>
		</Card>
	)
}
