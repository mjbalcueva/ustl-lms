import { Suspense } from 'react'

export default function Page({ params }: { params: { chatId: string } }) {
	return (
		<Suspense
			fallback={
				<div className="flex flex-1 items-center justify-center">
					<p className="text-muted-foreground">Loading...</p>
				</div>
			}
		>
			Chat {params.chatId}
		</Suspense>
	)
}
