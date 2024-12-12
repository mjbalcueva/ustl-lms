import { api } from '@/services/trpc/server'

import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@/core/components/ui/avatar'
import { PageContent, PageTitle } from '@/core/components/ui/page'
import { Separator } from '@/core/components/ui/separator'
import { Call, Info, Plus, VideoCall } from '@/core/lib/icons'

import { ChatList } from '@/features/chat/components/chat-list'
import { ActionButton } from '@/features/chat/components/ui/action-button'

export default async function Page() {
	const { chats } = await api.chat.getAllChats()

	return (
		<>
			<PageContent className="md:flex md:h-[calc(100vh-13px)]">
				<div className="w-72">
					<div className="hidden h-[57px] items-center justify-between border-b px-4 md:flex">
						<PageTitle className="font-bold">Chats</PageTitle>
						<ActionButton>
							<Plus className="!size-5 shrink-0" />
						</ActionButton>
					</div>
					<ChatList chats={chats} />
				</div>

				<Separator orientation="vertical" className="hidden h-full md:block" />
				<Separator
					orientation="horizontal"
					className="h-[1px] w-full md:hidden"
				/>

				<div className="flex-1">
					<div className="flex h-[57px] items-center justify-between border-b px-4">
						<div className="flex items-center gap-3">
							<Avatar className="size-8">
								<AvatarImage src="https://github.com/shadcn.png" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<PageTitle className="text-lg">Messages</PageTitle>
						</div>

						<div className="flex items-center gap-1">
							<ActionButton>
								<Call className="!size-[18px] shrink-0" />
							</ActionButton>
							<ActionButton>
								<VideoCall className="!size-5 shrink-0" />
							</ActionButton>
							<ActionButton>
								<Info className="!size-5 shrink-0" />
							</ActionButton>
						</div>
					</div>

					<div className="flex-1 p-4 text-center text-muted-foreground">
						Select a chat to start messaging
					</div>
				</div>
			</PageContent>
		</>
	)
}
