'use client'

import { useEffect, useState } from 'react'

import { api } from '@/services/trpc/react'

import { useDeviceType } from '@/core/components/context/device-type-provider'
import { PageTitle } from '@/core/components/ui/page'
import { Separator } from '@/core/components/ui/separator'
import { Plus } from '@/core/lib/icons'

import { ChatList } from '@/features/chat/components/chat-list'
import { ChatSection } from '@/features/chat/components/chat-section'
import { ActionButton } from '@/features/chat/components/ui/action-button'

export const ChatInterface = () => {
	const { data: chats } = api.chat.getAllChats.useQuery(undefined, {
		refetchInterval: 1000
	})
	const [selectedChat, setSelectedChat] = useState<{
		id: string
		type: 'direct' | 'group'
	} | null>(null)
	const [showNav] = useState(true)
	const { deviceSize } = useDeviceType()
	const isMobile = deviceSize === 'mobile'

	useEffect(() => {
		const firstChat = chats?.chats[0]
		if (firstChat && !selectedChat && !isMobile) {
			setSelectedChat({
				id: firstChat.id,
				type: firstChat.type
			})
		}
	}, [chats?.chats, selectedChat, isMobile])

	return (
		<>
			<div
				className={`w-72 ${isMobile && selectedChat ? 'hidden' : 'block'} md:block`}
			>
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

			<div
				className={`flex-1 ${!selectedChat && isMobile ? 'hidden' : 'block'}`}
			>
				{selectedChat && (
					<ChatSection
						chatId={selectedChat.id}
						chatType={selectedChat.type}
						showNav={showNav}
						onBackClick={() => {
							if (isMobile) {
								setSelectedChat(null)
							}
						}}
					/>
				)}
			</div>
		</>
	)
}
