import { PageContent } from '@/core/components/ui/page'

import { ChatInterface } from '@/features/chat/components/chat-interface'

export default function Page() {
	return (
		<PageContent className="h-full md:flex">
			<ChatInterface />
		</PageContent>
	)
}
