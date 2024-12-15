import { Suspense } from 'react'

import { ChatHeader } from '@/features/chat/components/chat/chat-header'

export default function Page({ params }: { params: { chatId: string } }) {
	return (
		<>
			<ChatHeader chatId={params.chatId} />

			<Suspense
				fallback={
					<div className="flex flex-1 items-center justify-center">
						<p className="text-muted-foreground">Loading...</p>
					</div>
				}
			>
				Chat {params.chatId}
			</Suspense>
		</>
	)
}
