'use client'

import { useEffect, useRef } from 'react'
import { differenceInMinutes } from 'date-fns'
import { useSession } from 'next-auth/react'

import { ScrollArea, ScrollBar } from '@/core/components/ui/scroll-area'

import { ChatMessage } from '@/features/chat/components/chat/chat-message'
import { useChatMessages } from '@/features/chat/hooks/use-chat-messages'

type ChatMessagesProps = {
	chatId: string
	type: 'direct' | 'group'
}

export function ChatMessages({ chatId, type }: ChatMessagesProps) {
	const { data: session } = useSession()
	const { messages: chatMessages, typingUsers } = useChatMessages(chatId, type)
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const scrollAreaRef = useRef<HTMLDivElement>(null)
	const lastMessageCountRef = useRef(chatMessages?.length ?? 0)

	useEffect(() => {
		const scrollArea = scrollAreaRef.current
		if (!scrollArea || !chatMessages) return

		const hasNewMessages = chatMessages.length > lastMessageCountRef.current
		const isNearBottom =
			scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight <
			100

		if (
			hasNewMessages &&
			(isNearBottom ||
				chatMessages[chatMessages.length - 1]?.senderId === session?.user?.id)
		) {
			setTimeout(() => {
				messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
			}, 0)
		}

		lastMessageCountRef.current = chatMessages.length
	}, [chatMessages, session?.user?.id])

	if (!chatMessages || !session?.user) {
		return <div>Loading messages...</div>
	}

	return (
		<ScrollArea
			className="h-[calc(100vh-114px)] flex-1 px-4 md:h-full"
			ref={scrollAreaRef}
		>
			<div className="space-y-1 pb-4 pt-16 md:pt-0">
				{[...chatMessages].reverse().map((message, index, arr) => {
					const prevMessage = index > 0 ? arr[index - 1] : null
					const nextMessage = index < arr.length - 1 ? arr[index + 1] : null

					const showTimestamp = prevMessage
						? differenceInMinutes(message.createdAt, prevMessage.createdAt) >=
							10
						: true

					const isFirstInSequence =
						!prevMessage ||
						prevMessage.senderId !== message.senderId ||
						showTimestamp
					const isLastInSequence =
						!nextMessage || nextMessage.senderId !== message.senderId

					console.log('Raw message:', message)
					console.log('Session user:', session.user)

					const formattedMessage = {
						id:
							'directChatMessageId' in message
								? message.directChatMessageId
								: message.groupChatMessageId,
						content: message.content,
						senderId:
							type === 'group'
								? (message.sender as { user: { id: string } }).user.id
								: message.senderId,
						senderName:
							type === 'group'
								? ((
										message.sender as {
											user: { profile: { name: string | null } }
										}
									).user.profile?.name ?? 'Unknown')
								: ((message.sender as { profile: { name: string | null } })
										.profile?.name ?? 'Unknown'),
						senderImage:
							type === 'group'
								? ((
										message.sender as {
											user: { profile: { imageUrl: string | null } }
										}
									).user.profile?.imageUrl ?? null)
								: ((message.sender as { profile: { imageUrl: string | null } })
										.profile?.imageUrl ?? null),
						createdAt: message.createdAt
					}

					return (
						<ChatMessage
							key={formattedMessage.id}
							message={formattedMessage}
							currentUserId={session.user.id}
							isFirstInSequence={isFirstInSequence}
							isLastInSequence={isLastInSequence}
							showTimestamp={showTimestamp}
						/>
					)
				})}
				<div ref={messagesEndRef} />
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	)
}
