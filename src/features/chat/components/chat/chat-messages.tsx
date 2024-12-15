'use client'

import * as React from 'react'
import { useSession } from 'next-auth/react'

import { api } from '@/services/trpc/react'

import { Button } from '@/core/components/ui/button'

import { useChatMessages } from '@/features/chat/hooks/use-chat-messages'

import { ChatMessage } from './chat-message'

type ChatMessagesProps = {
	chatId: string
	type: 'direct' | 'group'
}

export function ChatMessages({ chatId, type }: ChatMessagesProps) {
	const { data: session } = useSession()
	const { messages, typingUsers } = useChatMessages(chatId, type)
	const messagesEndRef = React.useRef<HTMLDivElement>(null)
	const scrollRef = React.useRef<HTMLDivElement>(null)

	// Scroll to bottom on new messages
	React.useEffect(() => {
		void messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	if (!messages) {
		return <div>Loading messages...</div>
	}

	return (
		<div className="flex flex-1 overflow-y-auto p-4" ref={scrollRef}>
			<div className="w-full space-y-4">
				<div>
					<Button
						variant="outline"
						className="w-full"
						onClick={() => {
							// Add load more logic here
						}}
					>
						Load more
					</Button>
				</div>

				{[...messages].reverse().map((msg) => {
					const message = {
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
						createdAt: msg.createdAt
					}

					return (
						<ChatMessage
							key={message.id}
							message={message}
							isCurrentUser={message.senderId === session?.user?.id}
						/>
					)
				})}

				{Object.keys(typingUsers).length > 0 && (
					<div className="text-sm italic text-muted-foreground">
						{Object.keys(typingUsers).length === 1
							? 'Someone is'
							: 'People are'}{' '}
						typing...
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>
		</div>
	)
}
