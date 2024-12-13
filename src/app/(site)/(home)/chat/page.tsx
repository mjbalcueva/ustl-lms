'use client'

import { useEffect, useState } from 'react'

import { api } from '@/services/trpc/react'

import { PageContent, PageTitle } from '@/core/components/ui/page'
import { Separator } from '@/core/components/ui/separator'
import { Plus } from '@/core/lib/icons'

import { ChatList } from '@/features/chat/components/chat-list'
import { ConversationChat } from '@/features/chat/components/conversation-chat'
import { ActionButton } from '@/features/chat/components/ui/action-button'

export default function Page() {
	const { data: chats } = api.chat.getAllChats.useQuery()
	const [selectedChat, setSelectedChat] = useState<{
		id: string
		type: 'direct' | 'group'
	} | null>(null)

	useEffect(() => {
		const firstChat = chats?.chats[0]
		if (firstChat && !selectedChat) {
			setSelectedChat({
				id: firstChat.id,
				type: firstChat.type
			})
		}
	}, [chats?.chats, selectedChat])

	return (
		<PageContent className="md:flex md:h-[calc(100vh-13px)]">
			<div className="w-72">
				<div className="hidden h-[57px] items-center justify-between border-b px-4 md:flex">
					<PageTitle className="font-bold">Chats</PageTitle>
					<ActionButton>
						<Plus className="!size-5 shrink-0" />
					</ActionButton>
				</div>
				<ChatList
					chats={chats?.chats ?? []}
					onSelectChat={(chat) =>
						setSelectedChat({ id: chat.id, type: chat.type })
					}
					selectedChatId={selectedChat?.id}
				/>
			</div>

			<Separator orientation="vertical" className="hidden h-full md:block" />
			<Separator
				orientation="horizontal"
				className="h-[1px] w-full md:hidden"
			/>

			<div className="flex-1">
				<ConversationChat
					chatId={selectedChat?.id ?? ''}
					chatType={selectedChat?.type ?? 'direct'}
				/>
			</div>
		</PageContent>
	)
}
