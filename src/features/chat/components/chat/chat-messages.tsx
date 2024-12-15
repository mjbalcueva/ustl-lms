'use client'

import { useEffect, useRef } from 'react'
import { differenceInMinutes } from 'date-fns'
import { type User } from 'next-auth'

import { ScrollArea, ScrollBar } from '@/core/components/ui/scroll-area'

import { ChatMessage } from '@/features/chat/components/chat/chat-message'

export const ChatMessages = ({
	chatMessages,
	userData
}: {
	chatMessages: {
		id: string
		content: string
		senderId: string
		senderName: string
		senderImage: string | null | undefined
		createdAt: Date
	}[]
	userData: User
}) => {
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const scrollAreaRef = useRef<HTMLDivElement>(null)
	const lastMessageCountRef = useRef(chatMessages.length)

	useEffect(() => {
		const scrollArea = scrollAreaRef.current
		if (!scrollArea) return

		const hasNewMessages = chatMessages.length > lastMessageCountRef.current
		const isNearBottom =
			scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight <
			100

		if (
			hasNewMessages &&
			(isNearBottom ||
				chatMessages[chatMessages.length - 1]?.senderId === userData.id)
		) {
			setTimeout(() => {
				messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
			}, 0)
		}

		lastMessageCountRef.current = chatMessages.length
	}, [chatMessages, userData.id])

	return (
		<ScrollArea
			className="h-[calc(100vh-114px)] flex-1 px-4 md:h-full"
			ref={scrollAreaRef}
		>
			<div className="space-y-1 pb-4 pt-16 md:pt-0">
				{chatMessages.map((message, index) => {
					const prevMessage = index > 0 ? chatMessages[index - 1] : null
					const nextMessage =
						index < chatMessages.length - 1 ? chatMessages[index + 1] : null

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
							key={message.id}
							message={message}
							currentUserId={userData.id ?? ''}
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
