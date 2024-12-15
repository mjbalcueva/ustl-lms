'use client'

import { useDeviceType } from '@/core/components/context/device-type-provider'
import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@/core/components/ui/avatar'
import { ArrowLeft, Call, Info, VideoCall } from '@/core/lib/icons'

import { ActionButton } from '../ui/action-button'

type ChatHeaderProps = {
	image: string
	title: string
	showNav: boolean
	onBackClick?: () => void
}

export const ChatHeader = ({
	image,
	title,
	showNav,
	onBackClick
}: ChatHeaderProps) => {
	const { deviceSize } = useDeviceType()
	const isMobile = deviceSize === 'mobile'

	return (
		<div
			className="flex h-[57px] items-center justify-between border-b px-4"
			style={{
				transform: !showNav && isMobile ? 'translateY(-100%)' : 'translateY(0)',
				transition: 'transform 0.3s ease-in-out'
			}}
		>
			<div className="flex items-center gap-3">
				{isMobile && (
					<ActionButton className="hover:text-primary" onClick={onBackClick}>
						<ArrowLeft className="size-5 shrink-0" />
					</ActionButton>
				)}
				<Avatar className="size-8">
					<AvatarImage src={image} />
					<AvatarFallback>{title[0]?.toUpperCase() ?? '?'}</AvatarFallback>
				</Avatar>
				<h2 className="text-lg font-semibold">{title}</h2>
			</div>

			<div className="flex items-center gap-1">
				<ActionButton className="hover:text-primary">
					<Call className="!size-[18px] shrink-0" />
				</ActionButton>
				<ActionButton className="hover:text-primary">
					<VideoCall className="!size-5 shrink-0" />
				</ActionButton>
				<ActionButton className="hover:text-primary">
					<Info className="!size-5 shrink-0" />
				</ActionButton>
			</div>
		</div>
	)
}
