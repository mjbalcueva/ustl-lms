import { api } from '@/services/trpc/server'

import { PageContent, PageTitle } from '@/core/components/ui/page'
import { Separator } from '@/core/components/ui/separator'
import { Plus, Search } from '@/core/lib/icons'

import { ChatList } from '@/features/chat/components/chat-list'
import { ActionButton } from '@/features/chat/components/ui/action-button'

export default async function Page({
	params: { chatId }
}: {
	params: { chatId: string }
}) {
	const { chats } = await api.chat.findManyConversations()

	return (
		<PageContent className="h-full md:flex">
			<div className={`hidden w-72 md:block`}>
				<div className="hidden h-[57px] items-center justify-between border-b px-4 md:flex">
					<PageTitle className="font-bold">Chats</PageTitle>
					<div className="flex items-center">
						<ActionButton>
							<Search className="!size-5 shrink-0" />
						</ActionButton>
						<ActionButton>
							<Plus className="!size-5 shrink-0" />
						</ActionButton>
					</div>
				</div>

				<ChatList chats={chats} activeChatId={chatId} />
			</div>

			<Separator orientation="vertical" className="hidden h-full md:block" />
			<Separator
				orientation="horizontal"
				className="h-[1px] w-full md:hidden"
			/>

			<div className="flex flex-1 items-center justify-center">
				<p className="text-muted-foreground">Select a chat to continue</p>
			</div>
		</PageContent>
	)
}
