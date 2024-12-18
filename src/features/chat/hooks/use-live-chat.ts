import * as React from 'react'

import { api } from '@/services/trpc/react'

type ChatMessage = {
	id: string
	content: string
	senderId: string
	senderName: string | null
	senderImage: string | null
	createdAt: Date
	chatId: string
	type: 'direct' | 'group'
	readBy: Array<{
		id: string
		name: string | null
		image: string | null
	}>
	isLastReadByUser: boolean
}

type TypingIndicator = Record<string, { lastTyped: Date }>

type DirectMessage = {
	directChatMessageId: string
	directChatId: string
	senderId: string
	content: string
	fileUrl: string | null
	deleted: boolean
	createdAt: Date
	updatedAt: Date
	sender: {
		id: string
		profile?: {
			name: string | null
			imageUrl: string | null
		} | null
	}
	readBy?: Array<{
		userId: string
		user: {
			profile: {
				name: string | null
				imageUrl: string | null
			} | null
		} | null
	}>
	isLastReadByUser?: boolean
}

type GroupMessage = {
	groupChatMessageId: string
	groupChatId: string
	senderId: string
	content: string
	fileUrl: string | null
	deleted: boolean
	createdAt: Date
	updatedAt: Date
	sender: {
		groupChatMemberId: string
		userId: string
		user: {
			id: string
			profile?: {
				name: string | null
				imageUrl: string | null
			} | null
		}
	}
	readBy?: Array<{
		userId: string
		user: {
			profile: {
				name: string | null
				imageUrl: string | null
			} | null
		} | null
	}>
	isLastReadByUser?: boolean
}

type RawMessage = DirectMessage | GroupMessage

/**
 * Safely converts a value to a Date object
 */
function toValidDate(date: Date | string | number | undefined): Date | null {
	if (!date) return null
	if (date instanceof Date) return isNaN(date.getTime()) ? null : date
	if (typeof date === 'number' && isNaN(date)) return null

	try {
		const parsed = new Date(date)
		return isNaN(parsed.getTime()) ? null : parsed
	} catch {
		return null
	}
}

function isGroupMessage(msg: RawMessage): msg is GroupMessage {
	return 'groupChatMessageId' in msg
}

function transformReadBy(msg: RawMessage): Array<{
	id: string
	name: string | null
	image: string | null
}> {
	if (!msg.readBy) return []

	// Only include read receipts for the latest message
	return msg.readBy.map((reader) => ({
		id: reader.userId,
		name: reader.user?.profile?.name ?? null,
		image: reader.user?.profile?.imageUrl ?? null
	}))
}

/**
 * Hook to handle real-time chat messages and typing indicators
 */
export function useLiveChat(chatId: string, type: 'direct' | 'group') {
	const utils = api.useUtils()
	const [messages, setMessages] = React.useState<ChatMessage[] | null>(null)
	const [typingData, setTypingData] = React.useState<TypingIndicator>({})

	// Get messages with automatic updates enabled
	const { data: initialData } = api.chat.getConversationMessages.useQuery(
		{ conversationId: chatId, type },
		{
			refetchOnReconnect: true,
			refetchOnWindowFocus: true,
			refetchInterval: 5000 // Poll every 5 seconds to update read receipts
		}
	)

	// Initialize messages from query data
	React.useEffect(() => {
		if (initialData?.messages) {
			const transformedMessages = initialData.messages
				.filter((msg): msg is NonNullable<typeof msg> => msg !== null)
				.map((msg) => {
					try {
						const rawMsg = msg as RawMessage
						const validDate = toValidDate(rawMsg.createdAt)
						if (!validDate) return null

						const isGroupMsg = isGroupMessage(rawMsg)

						if (isGroupMsg) {
							return {
								id: rawMsg.groupChatMessageId,
								content: rawMsg.content,
								senderId: rawMsg.sender.userId,
								senderName: rawMsg.sender.user.profile?.name ?? null,
								senderImage: rawMsg.sender.user.profile?.imageUrl ?? null,
								createdAt: validDate,
								chatId: rawMsg.groupChatId,
								type: 'group',
								readBy: transformReadBy(rawMsg),
								isLastReadByUser: rawMsg.isLastReadByUser ?? false
							} as ChatMessage
						} else {
							return {
								id: rawMsg.directChatMessageId,
								content: rawMsg.content,
								senderId: rawMsg.sender.id,
								senderName: rawMsg.sender.profile?.name ?? null,
								senderImage: rawMsg.sender.profile?.imageUrl ?? null,
								createdAt: validDate,
								chatId: rawMsg.directChatId,
								type: 'direct',
								readBy: transformReadBy(rawMsg),
								isLastReadByUser: rawMsg.isLastReadByUser ?? false
							} as ChatMessage
						}
					} catch {
						return null
					}
				})
				.filter((msg): msg is ChatMessage => msg !== null)

			setMessages(transformedMessages)
		}
	}, [initialData?.messages, type])

	// Subscribe to new messages
	api.chat.onMessage.useSubscription(
		{ chatId, lastMessageId: null },
		{
			onData(trackedMessage) {
				// Get the actual message data from the tracked wrapper
				const message = trackedMessage as unknown as ChatMessage

				// Update messages immediately
				setMessages((prev) => {
					if (!prev) return prev
					const validDate = toValidDate(message.createdAt)
					if (!validDate) return prev

					// Find any existing read receipts for this message
					const existingMessage = prev.find((m) => m.id === message.id)
					const mergedReadBy = existingMessage
						? [...existingMessage.readBy, ...(message.readBy ?? [])].filter(
								(reader, index, self) =>
									index === self.findIndex((r) => r.id === reader.id)
							)
						: (message.readBy ?? [])

					const newMessage: ChatMessage = {
						id: message.id,
						content: message.content,
						senderId: message.senderId,
						senderName: message.senderName,
						senderImage: message.senderImage,
						createdAt: validDate,
						chatId: message.chatId,
						type: message.type,
						readBy: mergedReadBy,
						isLastReadByUser: message.isLastReadByUser ?? false
					}

					// If message exists, update it, otherwise add it
					return existingMessage
						? prev.map((m) => (m.id === message.id ? newMessage : m))
						: [...prev, newMessage]
				})

				// Also invalidate the query to get any missed messages
				void utils.chat.getConversationMessages.invalidate({
					conversationId: chatId,
					type
				})
			}
		}
	)

	// Subscribe to typing indicators
	api.chat.whoIsTyping.useSubscription(
		{ chatId },
		{
			onData(data) {
				setTypingData(data as TypingIndicator)
			},
			onError(err) {
				console.error('Typing subscription error:', err)
			}
		}
	)

	const typingUsers = Object.keys(typingData)

	// Send message mutation
	const sendMessage = api.chat.sendMessage.useMutation({
		onSuccess: () => {
			void utils.chat.getConversationMessages.invalidate({
				conversationId: chatId,
				type
			})
		}
	})

	return {
		messages,
		typingUsers,
		sendMessage,
		isTypingMutation: useThrottledIsTypingMutation(chatId)
	}
}

/**
 * Throttled typing indicator mutation
 */
export function useThrottledIsTypingMutation(chatId: string) {
	const isTyping = api.chat.isTyping.useMutation()

	return React.useMemo(() => {
		let state = false
		let timeout: ReturnType<typeof setTimeout> | null = null

		function trigger() {
			if (timeout) clearTimeout(timeout)
			timeout = null
			void isTyping.mutate({ chatId, typing: state })
		}

		return (nextState: boolean) => {
			const shouldTriggerImmediately = nextState !== state
			state = nextState

			if (shouldTriggerImmediately) {
				trigger()
			} else if (!timeout) {
				timeout = setTimeout(trigger, 1000)
			}
		}
	}, [chatId, isTyping])
}
