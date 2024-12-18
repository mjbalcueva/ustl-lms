'use client'

import { useEffect, useRef } from 'react'
import { differenceInMinutes } from 'date-fns'
import { useSession } from 'next-auth/react'

import { api } from '@/services/trpc/react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@/core/components/ui/avatar'
import { ScrollArea, ScrollBar } from '@/core/components/ui/scroll-area'
import { Dot } from '@/core/lib/icons'

import { ChatMessage } from '@/features/chat/components/chat/chat-message'
import { useLiveChat } from '@/features/chat/hooks/use-live-chat'

type ChatMessagesProps = {
	chatId: string
	type: 'direct' | 'group'
}

export function ChatMessages({ chatId, type }: ChatMessagesProps) {
	const { data: session } = useSession()
	const { messages: chatMessages, typingUsers } = useLiveChat(chatId, type)
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const scrollAreaRef = useRef<HTMLDivElement>(null)
	const lastMessageCountRef = useRef(chatMessages?.length ?? 0)

	const markAsRead = api.chat.markAsRead.useMutation()

	useEffect(() => {
		const scrollArea = scrollAreaRef.current
		if (!scrollArea || !chatMessages || !session?.user?.id) return

		const hasNewMessages = chatMessages.length > lastMessageCountRef.current
		const isNearBottom =
			scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight <
			100

		if (
			hasNewMessages &&
			(isNearBottom ||
				chatMessages[chatMessages.length - 1]?.senderId === session.user.id)
		) {
			setTimeout(() => {
				messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
			}, 0)

			void markAsRead.mutate({
				conversationId: chatId,
				type
			})
		}

		lastMessageCountRef.current = chatMessages.length
	}, [chatMessages, chatId, type, session?.user?.id, markAsRead])

	const isTyping = typingUsers.some((id) => id !== session?.user?.id)
	const firstTypingUser = typingUsers.find((id) => id !== session?.user?.id)

	if (!chatMessages || !session?.user) {
		return <div>Loading messages...</div>
	}

	// Create a reversed copy of messages for display
	const displayMessages = [...chatMessages].reverse()

	return (
		<ScrollArea
			className="h-[calc(100vh-114px)] flex-1 px-4 md:h-full"
			ref={scrollAreaRef}
		>
			<div className="space-y-0.5 pb-32 pt-16 md:pb-4 md:pt-0">
				{displayMessages.map((message, index, arr) => {
					const prevMessage = index > 0 ? arr[index - 1] : null
					const nextMessage = index < arr.length - 1 ? arr[index + 1] : null

					const showTimestamp = prevMessage
						? differenceInMinutes(message.createdAt, prevMessage.createdAt) >=
							10
						: true

					const isFirstInSequence =
						!prevMessage ||
						prevMessage.senderId !== message.senderId ||
						(prevMessage &&
							differenceInMinutes(message.createdAt, prevMessage.createdAt) >=
								10)

					const isLastInSequence =
						!nextMessage ||
						nextMessage.senderId !== message.senderId ||
						(nextMessage &&
							differenceInMinutes(nextMessage.createdAt, message.createdAt) >=
								10)

					// Add messageIndex based on original order (since displayMessages is reversed)
					const messageWithIndex = {
						...message,
						messageIndex: displayMessages.length - 1 - index
					}

					return (
						<ChatMessage
							key={message.id}
							message={messageWithIndex}
							currentUserId={session.user.id}
							type={type}
							isFirstInSequence={isFirstInSequence}
							isLastInSequence={isLastInSequence}
							showTimestamp={showTimestamp}
						/>
					)
				})}

				{isTyping && firstTypingUser && (
					<div className="group flex justify-start pt-2">
						<div className="flex max-w-[80%] items-end gap-2">
							<Avatar className="size-8 border">
								<AvatarImage
									src={
										chatMessages?.find((m) => m.senderId === firstTypingUser)
											?.senderImage ?? ''
									}
									alt="Typing user"
								/>
								<AvatarFallback>
									{chatMessages
										?.find((m) => m.senderId === firstTypingUser)
										?.senderName?.[0]?.toUpperCase() ?? '?'}
								</AvatarFallback>
							</Avatar>

							<div className="flex flex-col gap-1">
								<div className="flex h-[32px] items-center rounded-2xl rounded-bl-md bg-muted px-3 transition-colors hover:bg-muted/90">
									<div className="flex -space-x-2.5">
										<Dot className="h-5 w-5 animate-typing-dot-bounce" />
										<Dot className="h-5 w-5 animate-typing-dot-bounce [animation-delay:90ms]" />
										<Dot className="h-5 w-5 animate-typing-dot-bounce [animation-delay:180ms]" />
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	)
}
