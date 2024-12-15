'use client'

import Link from 'next/link'

import { api } from '@/services/trpc/react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@/core/components/ui/avatar'
import { Call, ChevronLeft, Info, VideoCall } from '@/core/lib/icons'

import { ActionButton } from '@/features/chat/components/ui/action-button'

export const ChatHeader = ({ chatId }: { chatId: string }) => {
	const { data } = api.chat.findManyConversations.useQuery()

	const chat = data?.chats.find((chat) => chat.chatId === chatId)

	return (
		<div className="flex h-[57px] items-center justify-between border-b px-2 sm:px-4">
			<div className="flex items-center gap-3">
				<ActionButton className="p-0 hover:text-primary md:hidden" asChild>
					<Link href="/chat">
						<ChevronLeft className="!size-5 shrink-0" />
					</Link>
				</ActionButton>
				<Avatar className="size-8 border">
					<AvatarImage src={chat?.image ?? ''} />
					<AvatarFallback>{chat?.name[0]?.toUpperCase() ?? '?'}</AvatarFallback>
				</Avatar>
				<h2 className="line-clamp-1 text-lg font-semibold">{chat?.name}</h2>
			</div>

			<div className="flex items-center gap-1">
				<ActionButton className="hover:text-primary">
					<Call className="!size-[18px] shrink-0" />
				</ActionButton>
				<ActionButton className="hover:text-primary">
					<VideoCall className="!size-5 shrink-0" />
				</ActionButton>
				<ActionButton className="hover:text-primary">
					<Info className="!size-5 shrink-0" />
				</ActionButton>
			</div>
		</div>
	)
}
