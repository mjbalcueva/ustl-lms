import { api } from '@/services/trpc/server'

import { PageContent, PageTitle } from '@/core/components/ui/page'
import { Separator } from '@/core/components/ui/separator'
import { Plus, Search } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'

import { ChatList } from '@/features/chat/components/chat-list'
import { ActionButton } from '@/features/chat/components/ui/action-button'

export default async function Page() {
	const { chats } = await api.chat.findManyConversations()
	const hasChats = chats.length > 0

	return (
		<PageContent className="h-full md:flex">
			<div className="md:w-72">
				<div className="flex h-[57px] items-center justify-between border-b px-4">
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

				<ChatList chats={chats} />
			</div>

			<Separator orientation="vertical" className="hidden h-full md:block" />

			{/* {hasChats ? (
				<div className="flex min-h-[calc(100vh-57px)] flex-1 items-center justify-center">
					<p className="text-muted-foreground">Select a chat to continue</p>
				</div>
			) : (
				<div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
					<div className="space-y-1 text-muted-foreground">
						<h3 className="text-lg font-semibold">No chats found</h3>
						<p>
							Start a conversation with others or join a course to connect with
							other people
						</p>
					</div>
				</div>
			)} */}

			<div
				className={cn(
					'hidden flex-1 items-center justify-center md:flex',
					hasChats
						? 'min-h-[calc(100vh-57px)]'
						: 'flex-col gap-4 p-8 text-center'
				)}
			>
				{hasChats ? (
					<p className="text-muted-foreground">Select a chat to continue</p>
				) : (
					<div className="space-y-1 text-muted-foreground">
						<h3 className="text-lg font-semibold">No chats found</h3>
						<p>
							Start a conversation with others or join a course to connect with
							other people
						</p>
					</div>
				)}
			</div>
		</PageContent>
	)
}
