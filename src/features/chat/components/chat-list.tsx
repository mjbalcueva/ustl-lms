'use client'

import Link from 'next/link'
import { type FC } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { useSession } from 'next-auth/react'

import { api } from '@/services/trpc/react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@/core/components/ui/avatar'
import { Skeleton } from '@/core/components/ui/skeleton'

export const ChatList: FC = () => {
	const { data: session } = useSession()
	const { data, isLoading } = api.chat.getAllChats.useQuery()

	if (isLoading) {
		return <ChatListSkeleton />
	}

	if (!data) return null

	const { directConversations, groupChats } = data

	return (
		<div className="space-y-6">
			{/* Group Chats Section */}
			{groupChats.length > 0 && (
				<div>
					<h3 className="mb-4 font-semibold">Group Chats</h3>
					<div className="space-y-4">
						{groupChats.map((chat) => (
							<Link
								key={chat.chatRoomId}
								href={`/chat/room/${chat.chatRoomId}`}
								className="flex items-center gap-4 rounded-lg p-3 hover:bg-accent"
							>
								<Avatar className="size-10">
									{/* You might want to add a group avatar here */}
									<AvatarFallback>{chat.name[0]}</AvatarFallback>
								</Avatar>
								<div className="flex-1 overflow-hidden">
									<div className="flex items-center justify-between">
										<h4 className="font-medium">{chat.name}</h4>
										{chat.messages[0] && (
											<span className="text-xs text-muted-foreground">
												{formatDistanceToNow(
													new Date(chat.messages[0].createdAt),
													{ addSuffix: true }
												)}
											</span>
										)}
									</div>
									{chat.messages[0] && (
										<p className="truncate text-sm text-muted-foreground">
											{chat.messages[0].sender.user.profile?.name}:{' '}
											{chat.messages[0].content}
										</p>
									)}
								</div>
							</Link>
						))}
					</div>
				</div>
			)}

			{/* Direct Messages Section */}
			{directConversations.length > 0 && (
				<div>
					<h3 className="mb-4 font-semibold">Direct Messages</h3>
					<div className="space-y-4">
						{directConversations.map((conversation) => {
							const otherUser =
								conversation.memberOne.id === session?.user.id
									? conversation.memberTwo
									: conversation.memberOne

							return (
								<Link
									key={conversation.chatConversationId}
									href={`/chat/conversation/${conversation.chatConversationId}`}
									className="flex items-center gap-4 rounded-lg p-3 hover:bg-accent"
								>
									<Avatar className="h-12 w-12">
										<AvatarImage src={otherUser.profile?.imageUrl ?? ''} />
										<AvatarFallback>
											{otherUser.profile?.name?.[0]}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 overflow-hidden">
										<div className="flex items-center justify-between">
											<h4 className="font-medium">{otherUser.profile?.name}</h4>
											{conversation.messages[0] && (
												<span className="text-xs text-muted-foreground">
													{formatDistanceToNow(
														new Date(conversation.messages[0].createdAt),
														{ addSuffix: true }
													)}
												</span>
											)}
										</div>
										{conversation.messages[0] && (
											<p className="truncate text-sm text-muted-foreground">
												{conversation.messages[0].content}
											</p>
										)}
									</div>
								</Link>
							)
						})}
					</div>
				</div>
			)}
		</div>
	)
}

const ChatListSkeleton: FC = () => (
	<div className="space-y-4">
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
