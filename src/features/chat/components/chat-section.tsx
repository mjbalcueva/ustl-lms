'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { type User } from 'next-auth'
import { useSession } from 'next-auth/react'

import { api } from '@/services/trpc/react'

import { ChatHeader } from '@/features/chat/components/chat/chat-header'
import { ChatInput } from '@/features/chat/components/chat/chat-input'
import { ChatMessages } from '@/features/chat/components/chat/chat-messages'

type ChatSectionProps = {
	chatId: string
	chatType: 'direct' | 'group'
}

export const ChatSection = ({ chatId, chatType }: ChatSectionProps) => {
	const { data: session } = useSession()
	const [input, setInput] = useState('')

	const messagesEndRef = useRef<HTMLDivElement>(null)

	const trpc = api.useUtils()

	const { data: conversation, isLoading } =
		api.chat.getConversationMessages.useQuery({
			conversationId: chatId,
			type: chatType
		})

	const { mutate: sendMessage } = api.chat.sendMessage.useMutation({
		onSuccess: () => {
			setInput('')
			void trpc.chat.getConversationMessages.invalidate()
		}
	})

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(e.target.value)
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!input.trim()) return

		sendMessage({
			conversationId: chatId,
			type: chatType,
			content: input.trim()
		})
	}

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'end'
		})
	}, [conversation?.messages])

	if (isLoading || !conversation) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-muted-foreground">Loading conversation...</p>
			</div>
		)
	}

	return (
		<div className="flex h-full flex-col">
			<ChatHeader image={conversation.image ?? ''} title={conversation.title} />

			<ChatMessages
				chatMessages={conversation.messages}
				userData={session?.user as User}
			/>

			<ChatInput
				input={input}
				handleInputChange={handleInputChange}
				handleSubmit={handleSubmit}
			/>
		</div>
	)
}
