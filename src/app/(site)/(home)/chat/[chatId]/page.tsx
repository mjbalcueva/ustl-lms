import { Suspense } from 'react'

import { ChatInterface } from '@/features/chat/components/chat-interface'

export default function Page({
	params: { chatId }
}: {
	params: { chatId: string }
}) {
	return (
		<div className="flex h-full flex-col">
			<Suspense
				fallback={
					<div className="flex flex-1 items-center justify-center">
						<p className="text-muted-foreground">Loading...</p>
					</div>
				}
			>
				<ChatInterface chatId={chatId} />
			</Suspense>
		</div>
	)
}
