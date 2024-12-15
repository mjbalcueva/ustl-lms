'use client'

import { useEffect, useRef } from 'react'
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

	useEffect(() => {
		const scrollArea = scrollAreaRef.current
		if (!scrollArea) return

		const shouldAutoScroll =
			scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight <
			100

		if (shouldAutoScroll) {
			setTimeout(() => {
				messagesEndRef.current?.scrollIntoView()
			}, 0)
		}
	}, [chatMessages])

	return (
		<ScrollArea className="flex-1 overflow-y-auto px-4" ref={scrollAreaRef}>
			<div className="space-y-1 py-4">
				{chatMessages.map((message, index) => {
					const isFirstInSequence =
						index === 0 ||
						chatMessages[index - 1]?.senderId !== message.senderId
					const isLastInSequence =
						index === chatMessages.length - 1 ||
						chatMessages[index + 1]?.senderId !== message.senderId

					return (
						<ChatMessage
							key={message.id}
							message={message}
							currentUserId={userData.id ?? ''}
							isFirstInSequence={isFirstInSequence}
							isLastInSequence={isLastInSequence}
						/>
					)
				})}
				<div ref={messagesEndRef} />
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	)
}
