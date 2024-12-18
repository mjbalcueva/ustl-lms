import * as React from 'react'

import { api } from '@/services/trpc/react'

export function useChatMessages(chatId: string, type: 'direct' | 'group') {
	const utils = api.useUtils()
	const [typingUsers, setTypingUsers] = React.useState<
		Record<string, { lastTyped: Date }>
	>({})

	// Get messages with automatic updates enabled
	const { data: messages } = api.chat.getConversationMessages.useQuery(
		{ conversationId: chatId, type },
		{
			refetchOnReconnect: true,
			refetchOnWindowFocus: true,
			refetchInterval: 1000 // Poll every second
		}
	)

	// Subscribe to new messages
	api.chat.onMessage.useSubscription(
		{ chatId, lastMessageId: null },
		{
			onData: () => {
				void utils.chat.getConversationMessages.invalidate()
			}
		}
	)

	// Subscribe to typing indicators
	api.chat.whoIsTyping.useSubscription(
		{ chatId },
		{
			onData: (data: AsyncIterable<Record<string, { lastTyped: Date }>>) => {
				void (async () => {
					for await (const update of data) {
						setTypingUsers(update)
					}
				})()
			}
		}
	)

	return {
		messages: messages?.messages,
		typingUsers
	}
}
