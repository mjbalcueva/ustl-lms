'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'

import { api } from '@/services/trpc/react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@/core/components/ui/avatar'
import { Call, ChevronLeft, VideoCall } from '@/core/lib/icons'

import { ActionButton } from '@/features/chat/components/ui/action-button'

export const ChatHeader = ({ chatId }: { chatId: string }) => {
	const { data } = api.chat.findManyConversations.useQuery()
	const { scrollYProgress } = useScroll()
	const [showNav, setShowNav] = useState(true)

	useMotionValueEvent(scrollYProgress, 'change', (current) => {
		const previous = scrollYProgress.getPrevious()!
		setShowNav(previous === 0 || current === 1 || previous > current)
	})

	const chat = data?.chats.find((chat) => chat.chatId === chatId)

	return (
		<motion.div
			className="fixed left-0 right-0 top-14 z-[5] flex h-[57px] items-center justify-between border-b bg-card px-2 dark:bg-background sm:px-4 md:relative md:top-0"
			initial={{
				y: 0
			}}
			animate={{
				y: showNav ? 0 : -56 // Height of the top nav
			}}
		>
			<div className="flex items-center gap-3">
				<ActionButton className="p-0 hover:text-primary md:hidden" asChild>
					<Link href="/chat">
						<ChevronLeft className="!size-5 shrink-0" />
					</Link>
				</ActionButton>
				<Avatar className="size-10 border">
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
				{/* <ActionButton className="hover:text-primary">
					<Info className="!size-5 shrink-0" />
				</ActionButton> */}
			</div>
		</motion.div>
	)
}
