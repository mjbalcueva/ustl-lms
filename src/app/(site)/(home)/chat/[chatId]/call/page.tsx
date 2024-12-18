import { MediaRoom } from '@/features/chat/components/media-room'

export default function Page({
	params: { chatId },
	searchParams: { video, audio }
}: {
	params: { chatId: string }
	searchParams: { video: string; audio: string }
}) {
	return (
		<div className="flex h-full flex-col">
			<MediaRoom
				chatId={chatId}
				video={video === 'true'}
				audio={audio === 'true'}
			/>
		</div>
	)
}
