'use client'

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
	return (
		<ScrollArea className="flex-1 overflow-y-auto px-4">
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
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	)
}
