'use client'

import * as React from 'react'
import { skipToken } from '@tanstack/react-query'

import { api } from '@/services/trpc/react'

import { ChatInput } from './chat/chat-input'
import { ChatMessages } from './chat/chat-messages'

type ChatInterfaceProps = {
	chatId: string
}

export function ChatInterface({ chatId }: ChatInterfaceProps) {
	const [type, setType] = React.useState<'direct' | 'group'>()
	const utils = api.useUtils()

	// Query to determine chat type
	const { data: chatType } = api.chat.getChatType.useQuery(
		{ chatId },
		{
			retry: false,
			refetchOnWindowFocus: false
		}
	)

	React.useEffect(() => {
		if (chatType) {
			setType(chatType)
		}
	}, [chatType])

	// Only verify chat once we know the type
	const { data: chatExists } = api.chat.verifyChat.useQuery(
		type ? { chatId, type } : skipToken,
		{
			retry: false,
			refetchOnWindowFocus: false,
			enabled: !!type
		}
	)

	const sendMessage = api.chat.sendMessage.useMutation({
		onSuccess: () => {
			if (type) {
				void utils.chat.getConversationMessages.invalidate({
					conversationId: chatId,
					type
				})
			}
		}
	})

	const isTyping = api.chat.isTyping.useMutation()

	const handleTyping = (typing: boolean) => {
		if (type) {
			void isTyping.mutate({ chatId, typing })
		}
	}

	const handleSendMessage = async (content: string) => {
		if (!type || !chatExists) {
			throw new Error('Chat not found')
		}

		await sendMessage.mutateAsync({
			conversationId: chatId,
			type,
			content
		})
	}

	if (!type) {
		return <div>Loading...</div>
	}

	if (!chatExists) {
		return <div>Chat not found or access denied</div>
	}

	return (
		<div className="flex h-full flex-col">
			<ChatMessages chatId={chatId} type={type} />
			<ChatInput
				onSend={handleSendMessage}
				onTyping={handleTyping}
				isLoading={sendMessage.isPending}
			/>
		</div>
	)
}
