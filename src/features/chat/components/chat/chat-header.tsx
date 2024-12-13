import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@/core/components/ui/avatar'
import { Call, Info, VideoCall } from '@/core/lib/icons'

import { ActionButton } from '../ui/action-button'

export const ChatHeader = ({
	image,
	title
}: {
	image: string
	title: string
}) => {
	return (
		<div className="flex h-[57px] items-center justify-between border-b px-4">
			<div className="flex items-center gap-3">
				<Avatar className="size-8">
					<AvatarImage src={image} />
					<AvatarFallback>{title[0]?.toUpperCase() ?? '?'}</AvatarFallback>
				</Avatar>
				<h2 className="text-lg font-semibold">{title}</h2>
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
	)
}
