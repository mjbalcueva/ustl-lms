'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { useSession } from 'next-auth/react'

import { type RouterOutputs } from '@/services/trpc/react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@/core/components/ui/avatar'
import { Skeleton } from '@/core/components/ui/skeleton'

type ChatListProps = {
	chats: RouterOutputs['chat']['getAllChats']['chats']
}

export const ChatList = ({ chats }: ChatListProps) => {
	const { data: session } = useSession()

	return (
		<div className="space-y-4">
			{chats.map((data) => {
				if (data.type === 'direct') {
					const otherUser =
						data.conversation.memberOne.id === session?.user.id
							? data.conversation.memberTwo
							: data.conversation.memberOne

					return (
						<Link
							key={data.id}
							href={`/chat/conversation/${data.id}`}
							className="flex items-center gap-4 rounded-lg p-3 hover:bg-accent"
						>
							<Avatar className="h-12 w-12">
								<AvatarImage src={otherUser.profile?.imageUrl ?? ''} />
								<AvatarFallback>
									{otherUser.profile?.name?.[0] ?? 'U'}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1 overflow-hidden">
								<div className="flex items-center justify-between">
									<h4 className="font-medium">{otherUser.profile?.name}</h4>
									{data.lastMessage && (
										<span className="text-xs text-muted-foreground">
											{formatDistanceToNow(
												new Date(data.lastMessage.createdAt),
												{ addSuffix: true }
											)}
										</span>
									)}
								</div>
								{data.lastMessage && (
									<p className="truncate text-sm text-muted-foreground">
										{data.lastMessage.content}
									</p>
								)}
							</div>
						</Link>
					)
				}

				// Group chat
				return (
					<Link
						key={data.id}
						href={`/chat/room/${data.id}`}
						className="flex items-center gap-4 rounded-lg p-3 hover:bg-accent"
					>
						<Avatar className="size-10">
							<AvatarImage src={data.chat.creator.profile?.imageUrl ?? ''} />
							<AvatarFallback>{data.chat.name?.[0] ?? 'G'}</AvatarFallback>
						</Avatar>
						<div className="flex-1 overflow-hidden">
							<div className="flex items-center justify-between">
								<h4 className="font-medium">{data.chat.name}</h4>
								{data.lastMessage && (
									<span className="text-xs text-muted-foreground">
										{formatDistanceToNow(new Date(data.lastMessage.createdAt), {
											addSuffix: true
										})}
									</span>
								)}
							</div>
							{data.lastMessage && (
								<p className="truncate text-sm text-muted-foreground">
									{data.lastMessage.sender.user.profile?.name}:{' '}
									{data.lastMessage.content}
								</p>
							)}
						</div>
					</Link>
				)
			})}
		</div>
	)
}

export const ChatListSkeleton = () => (
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
