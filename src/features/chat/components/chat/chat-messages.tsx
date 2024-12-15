'use client'

import { useEffect, useRef } from 'react'
import { differenceInMinutes } from 'date-fns'
import { useSession } from 'next-auth/react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@/core/components/ui/avatar'
import { ScrollArea, ScrollBar } from '@/core/components/ui/scroll-area'
import { Dot } from '@/core/lib/icons'

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

	const isTyping = Object.keys(typingUsers).some(
		(id) => id !== session?.user?.id
	)

	const firstTypingUser = Object.entries(typingUsers).find(
		([id]) => id !== session?.user?.id
	)?.[0]

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

					return (
						<ChatMessage
							key={
								'directChatMessageId' in message
									? message.directChatMessageId
									: message.groupChatMessageId
							}
							message={message}
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
										type === 'group'
											? ((
													chatMessages.find(
														(m) =>
															(m.sender as { user: { id: string } }).user.id ===
															firstTypingUser
													)?.sender as {
														user: { profile: { imageUrl: string | null } }
													}
												)?.user.profile?.imageUrl ?? '')
											: ((
													chatMessages.find(
														(m) => m.senderId === firstTypingUser
													)?.sender as { profile: { imageUrl: string | null } }
												)?.profile?.imageUrl ?? '')
									}
									alt="Typing user"
								/>
								<AvatarFallback>
									{type === 'group'
										? ((
												chatMessages.find(
													(m) =>
														(m.sender as { user: { id: string } }).user.id ===
														firstTypingUser
												)?.sender as {
													user: { profile: { name: string | null } }
												}
											)?.user.profile?.name?.[0]?.toUpperCase() ?? '?')
										: ((
												chatMessages.find((m) => m.senderId === firstTypingUser)
													?.sender as { profile: { name: string | null } }
											)?.profile?.name?.[0]?.toUpperCase() ?? '?')}
								</AvatarFallback>
							</Avatar>

							<div className="flex flex-col gap-1">
								<div className="rounded-2xl rounded-bl-md bg-muted px-3 py-2 transition-colors hover:bg-muted/90">
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
