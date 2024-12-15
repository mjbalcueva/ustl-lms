'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

import { api, type RouterOutputs } from '@/services/trpc/react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@/core/components/ui/avatar'
import { cn } from '@/core/lib/utils/cn'

type ChatListProps = {
	chats: RouterOutputs['chat']['findManyConversations']['chats']
	activeChatId?: string
}

export const ChatList = ({ chats, activeChatId }: ChatListProps) => {
	const utils = api.useUtils()
	const markAsRead = api.chat.markAsRead.useMutation({
		onSuccess: () => {
			// Invalidate the conversations query to update the UI
			void utils.chat.findManyConversations.invalidate()
		}
	})

	const handleChatClick = (chatId: string, type: 'direct' | 'group') => {
		markAsRead.mutate({ conversationId: chatId, type })
	}

	return (
		<div className="space-y-1 p-2">
			{chats.map((chat) => (
				<Link
					key={chat.chatId}
					href={`/chat/${chat.chatId}`}
					onClick={() => handleChatClick(chat.chatId, chat.type)}
					className={cn(
						'flex w-full items-center gap-2 rounded-lg px-2 py-3 text-left hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary',
						activeChatId === chat.chatId && 'bg-accent dark:bg-accent'
					)}
				>
					<Avatar className="h-10 w-10 border">
						<AvatarImage src={chat.image ?? ''} />
						<AvatarFallback>{chat.name[0] ?? '?'}</AvatarFallback>
					</Avatar>
					<div className="flex-1 overflow-hidden">
						<div className="flex items-center justify-between">
							<h4
								className={cn(
									'line-clamp-1 text-sm font-medium',
									!chat.lastMessage?.isRead && 'font-bold'
								)}
							>
								{chat.name}
							</h4>
						</div>

						<div className="flex items-center justify-between gap-1">
							<p
								className={cn(
									'flex-1 truncate text-xs text-muted-foreground',
									!chat.lastMessage?.isRead && 'font-medium text-foreground'
								)}
							>
								{chat.lastMessage ? (
									<>
										{chat.lastMessage.sender}: {chat.lastMessage.content}
									</>
								) : (
									<span className="font-normal text-muted-foreground">
										Start a conversation
									</span>
								)}
							</p>
							{chat.lastMessage?.createdAt && (
								<span className="shrink-0 text-xs text-muted-foreground">
									•{' '}
									{formatDistanceToNow(new Date(chat.lastMessage.createdAt), {
										addSuffix: false
									})
										.replace('about ', '')
										.replace('less than a minute', '1m')
										.replace('minutes', 'm')
										.replace('minute', 'm')
										.replace('hours', 'h')
										.replace('hour', 'h')
										.replace('days', 'd')
										.replace('day', 'd')
										.replace('months', 'mo')
										.replace('month', 'mo')
										.replace('years', 'y')
										.replace('year', 'y')
										.replace('weeks', 'w')
										.replace('week', 'w')
										.replace(/ /g, '')}
								</span>
							)}
						</div>
					</div>
				</Link>
			))}
		</div>
	)
}
