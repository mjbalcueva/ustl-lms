import { Suspense } from 'react'

import { ChatInterface } from '@/features/chat/components/chat-interface'
import { ChatHeader } from '@/features/chat/components/chat/chat-header'

export default function Page({ params }: { params: { chatId: string } }) {
	return (
		<div className="flex h-full flex-col">
			<ChatHeader chatId={params.chatId} />

			<Suspense
				fallback={
					<div className="flex flex-1 items-center justify-center">
						<p className="text-muted-foreground">Loading...</p>
					</div>
				}
			>
				<ChatInterface chatId={params.chatId} />
			</Suspense>
		</div>
	)
}
