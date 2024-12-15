'use client'

import { useState, type FormEvent } from 'react'
import { type User } from 'next-auth'
import { useSession } from 'next-auth/react'

import { api } from '@/services/trpc/react'

import { ChatHeader } from '@/features/chat/components/chat/chat-header'
import { ChatInput } from '@/features/chat/components/chat/chat-input'
import { ChatMessages } from '@/features/chat/components/chat/chat-messages'

type ChatSectionProps = {
	chatId: string
	chatType: 'direct' | 'group'
	onBackClick?: () => void
	showNav: boolean
}

export const ChatSection = ({
	chatId,
	chatType,
	onBackClick,
	showNav
}: ChatSectionProps) => {
	const { data: session } = useSession()
	const [input, setInput] = useState('')

	const utils = api.useUtils()

	const { data: conversation, isLoading } =
		api.chat.getConversationMessages.useQuery(
			{
				conversationId: chatId,
				type: chatType
			},
			{
				refetchInterval: 1000 // Poll every second
			}
		)

	const { mutate: sendMessage } = api.chat.sendMessage.useMutation({
		onMutate: async (newMessage) => {
			// Cancel outgoing fetches
			await utils.chat.getConversationMessages.cancel()
			await utils.chat.getAllChats.cancel()

			// Get current data
			const prevMessages = utils.chat.getConversationMessages.getData({
				conversationId: chatId,
				type: chatType
			})
			const prevChats = utils.chat.getAllChats.getData()

			// Optimistically update messages
			utils.chat.getConversationMessages.setData(
				{ conversationId: chatId, type: chatType },
				(old) => {
					if (!old) return old
					return {
						...old,
						messages: [
							...old.messages,
							{
								id: `temp-${Date.now()}`,
								content: newMessage.content,
								senderId: session?.user?.id ?? '',
								senderName: session?.user?.name ?? 'You',
								senderImage: session?.user?.imageUrl ?? null,
								createdAt: new Date()
							}
						]
					}
				}
			)

			// Optimistically update chat list
			utils.chat.getAllChats.setData(undefined, (old) => {
				if (!old) return old
				return {
					chats: old.chats.map((chat) =>
						chat.id === chatId
							? {
									...chat,
									lastMessage: newMessage.content,
									lastMessageSender: 'You',
									lastActiveAt: new Date()
								}
							: chat
					)
				}
			})

			return { prevMessages, prevChats }
		},
		onError: (_err, _newMessage, context) => {
			// Rollback on error
			if (context?.prevMessages) {
				utils.chat.getConversationMessages.setData(
					{ conversationId: chatId, type: chatType },
					context.prevMessages
				)
			}
			if (context?.prevChats) {
				utils.chat.getAllChats.setData(undefined, context.prevChats)
			}
		},
		onSettled: () => {
			// Sync with server
			void utils.chat.getConversationMessages.invalidate()
			void utils.chat.getAllChats.invalidate()
		}
	})

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(e.target.value)
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!input.trim()) return

		sendMessage({
			conversationId: chatId,
			type: chatType,
			content: input.trim()
		})
		setInput('')
	}

	if (isLoading || !conversation) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-muted-foreground">Loading conversation...</p>
			</div>
		)
	}

	return (
		<div className="flex h-[calc(100vh-57px)] flex-col md:h-full">
			<div className="fixed left-0 right-0 top-[57px] z-[5] border-b bg-background/80 backdrop-blur-sm md:sticky md:top-0">
				<ChatHeader
					image={conversation.image ?? ''}
					title={conversation.title}
					showNav={showNav}
					onBackClick={onBackClick}
				/>
			</div>

			<div className="flex-1 overflow-hidden">
				<ChatMessages
					chatMessages={conversation.messages}
					userData={session?.user as User}
				/>
			</div>

			<div className="fixed bottom-0 left-0 right-0 z-[5] border-t bg-background/80 backdrop-blur-sm md:sticky">
				<ChatInput
					input={input}
					handleInputChange={handleInputChange}
					handleSubmit={handleSubmit}
				/>
			</div>
		</div>
	)
}
