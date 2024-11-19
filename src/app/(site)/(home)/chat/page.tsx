import { PageDescription, PageHeader, PageTitle } from '@/core/components/ui/page'
import ChatList from '@/features/chat/components/chat-list'

export default async function Page() {
	return (
		<>
			<PageHeader>
				<PageTitle>Chat</PageTitle>
				<PageDescription>Chat with your friends</PageDescription>
			</PageHeader>

			<ChatList/>
		</>
	)
}
