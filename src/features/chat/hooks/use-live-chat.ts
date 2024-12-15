import * as React from 'react'
import { skipToken } from '@tanstack/react-query'

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
}

type TypingIndicator = Record<string, { lastTyped: Date }>

/**
 * Hook to handle real-time chat messages and typing indicators
 */
export function useLiveChat(chatId: string, type: 'direct' | 'group') {
	// Get initial messages
	const { data: initialData } = api.chat.getConversationMessages.useQuery(
		{ conversationId: chatId, type },
		{
			// No need to refetch as we have SSE subscription
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
			refetchOnMount: false
		}
	)

	// Track messages state
	const [messages, setMessages] = React.useState<ChatMessage[] | null>(null)

	// Track last message ID for SSE reconnection
	const [lastMessageId, setLastMessageId] = React.useState<
		string | null | false
	>(false)

	// Track typing indicators state
	const [typingData, setTypingData] = React.useState<TypingIndicator>({})

	// Initialize messages from query data
	React.useEffect(() => {
		if (initialData?.messages) {
			const transformedMessages: ChatMessage[] = initialData.messages.map(
				(msg) => ({
					id:
						'directChatMessageId' in msg
							? msg.directChatMessageId
							: msg.groupChatMessageId,
					content: msg.content,
					senderId: msg.senderId,
					senderName:
						('profile' in msg.sender
							? msg.sender.profile?.name
							: msg.sender.user.profile?.name) ?? null,
					senderImage:
						('profile' in msg.sender
							? msg.sender.profile?.imageUrl
							: msg.sender.user.profile?.imageUrl) ?? null,
					createdAt: msg.createdAt,
					chatId: 'directChatId' in msg ? msg.directChatId : msg.groupChatId,
					type: 'directChatId' in msg ? 'direct' : 'group'
				})
			)
			setMessages(transformedMessages)
			setLastMessageId(
				transformedMessages[transformedMessages.length - 1]?.id ?? null
			)
		}
	}, [initialData?.messages])

	// Function to add and dedupe new messages
	const addMessages = React.useCallback((incoming?: ChatMessage[]) => {
		setMessages((current) => {
			if (!current) return incoming ?? null
			if (!incoming) return current

			const map: Record<string, ChatMessage> = {}
			for (const msg of current) {
				map[msg.id] = msg
			}
			for (const msg of incoming) {
				map[msg.id] = msg
			}
			return Object.values(map).sort(
				(a, b) => a.createdAt.getTime() - b.createdAt.getTime()
			)
		})
	}, [])

	// Subscribe to new messages
	const messageSubscription = api.chat.onMessage.useSubscription(
		lastMessageId === false ? skipToken : { chatId, lastMessageId },
		{
			onData(event) {
				addMessages([event.data])
			},
			onError(err) {
				console.error('Message subscription error:', err)

				const lastMsgId = messages?.at(-1)?.id
				if (lastMsgId) {
					// Resubscribe from last message on error
					setLastMessageId(lastMsgId)
				}
			}
		}
	)

	// Subscribe to typing indicators
	const typingSubscription = api.chat.whoIsTyping.useSubscription(
		{ chatId },
		{
			onData(data: TypingIndicator) {
				setTypingData(data)
			},
			onError(err) {
				console.error('Typing subscription error:', err)
			}
		}
	)

	const typingUsers = Object.keys(typingData)

	// Send message mutation
	const sendMessage = api.chat.sendMessage.useMutation({
		onSuccess: (newMessage) => {
			addMessages([
				{
					id:
						'directChatMessageId' in newMessage
							? newMessage.directChatMessageId
							: newMessage.groupChatMessageId,
					content: newMessage.content,
					senderId: newMessage.senderId,
					senderName: null, // Will be updated by subscription
					senderImage: null, // Will be updated by subscription
					createdAt: newMessage.createdAt,
					chatId,
					type
				}
			])
		}
	})

	return {
		messages,
		typingUsers,
		sendMessage,
		isTypingMutation: useThrottledIsTypingMutation(chatId),
		messageSubscription,
		typingSubscription
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
