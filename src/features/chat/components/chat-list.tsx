'use client'

import { formatDistanceToNow } from 'date-fns'

import { type RouterOutputs } from '@/services/trpc/react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@/core/components/ui/avatar'
import { Skeleton } from '@/core/components/ui/skeleton'
import { cn } from '@/core/lib/utils/cn'

type Chat = RouterOutputs['chat']['getAllChats']['chats'][number]

type ChatListProps = {
	chats: Chat[]
	onSelectChat: (chat: Chat) => void
	selectedChatId?: string
}

export const ChatList = ({
	chats,
	onSelectChat,
	selectedChatId
}: ChatListProps) => {
	return (
		<div className="p-2">
			{chats.map((chat) => (
				<button
					key={chat.id}
					onClick={() => onSelectChat(chat)}
					className={cn(
						'flex w-full items-center gap-2 rounded-lg px-2 py-3 text-left hover:bg-accent',
						selectedChatId === chat.id && 'bg-accent'
					)}
				>
					<Avatar className="h-10 w-10">
						<AvatarImage src={chat.image ?? ''} />
						<AvatarFallback>{chat.title[0] ?? '?'}</AvatarFallback>
					</Avatar>
					<div className="flex-1 overflow-hidden">
						<div className="flex items-center justify-between">
							<h4
								className={cn(
									'line-clamp-1 text-sm font-medium',
									!chat.isRead && 'font-bold'
								)}
							>
								{chat.title}
							</h4>
						</div>
						{chat.lastMessage && (
							<>
								<div className="flex items-center justify-between gap-1">
									<p
										className={cn(
											'flex-1 truncate text-xs text-muted-foreground',
											!chat.isRead && 'font-semibold text-foreground'
										)}
									>
										{chat.lastMessageSender}: {chat.lastMessage}
									</p>
									{chat.lastActiveAt && (
										<span className="shrink-0 text-xs text-muted-foreground">
											•{' '}
											{formatDistanceToNow(new Date(chat.lastActiveAt), {
												addSuffix: false
											})
												.replace('about ', '')
												.replace('less than a minute', '1m')
												.replace('minutes', 'm')
												.replace('minute', 'm')
												.replace('hour', 'h')
												.replace('day', 'd')
												.replace('month', 'mo')
												.replace('year', 'y')
												.replace('week', 'w')
												.replace(/ /g, '')}
										</span>
									)}
								</div>
							</>
						)}
					</div>
				</button>
			))}
		</div>
	)
}

export const ChatListSkeleton = () => (
	<div className="space-y-4 p-4">
		{Array.from({ length: 4 }).map((_, i) => (
			<div key={i} className="flex items-center gap-4 rounded-lg p-3">
				<Skeleton className="h-12 w-12 rounded-full" />
				<div className="flex-1 space-y-2">
					<Skeleton className="h-4 w-1/4" />
					<Skeleton className="h-3 w-3/4" />
				</div>
			</div>
		))}
	</div>
)
