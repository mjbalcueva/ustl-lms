import { format, formatDistanceToNow, isToday } from 'date-fns'

import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@/core/components/ui/avatar'
import { cn } from '@/core/lib/utils/cn'

export type Message = {
	id: string
	content: string
	senderId: string
	senderName: string | null
	senderImage: string | null
	createdAt: Date
}

type ChatMessageProps = {
	message: Message
	isCurrentUser: boolean
}

export function ChatMessage({ message, isCurrentUser }: ChatMessageProps) {
	return (
		<div
			className={cn(
				'flex items-start gap-3',
				isCurrentUser ? 'justify-end' : 'justify-start'
			)}
		>
			{!isCurrentUser && (
				<Avatar className="size-8 border">
					<AvatarImage src={message.senderImage ?? ''} />
					<AvatarFallback>
						{message.senderName?.[0]?.toUpperCase() ?? '?'}
					</AvatarFallback>
				</Avatar>
			)}

			<div className="flex flex-col gap-1">
				<div
					className={cn(
						'rounded-lg p-3 text-sm',
						isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
					)}
				>
					<p>{message.content}</p>
				</div>
				<div className="text-xs text-muted-foreground">
					{message.senderName} ·{' '}
					{isToday(message.createdAt)
						? formatDistanceToNow(message.createdAt) + ' ago'
						: format(message.createdAt, 'MMM d, yyyy h:mm a')}
				</div>
			</div>

			{isCurrentUser && (
				<Avatar className="size-8 border">
					<AvatarImage src={message.senderImage ?? ''} />
					<AvatarFallback>
						{message.senderName?.[0]?.toUpperCase() ?? '?'}
					</AvatarFallback>
				</Avatar>
			)}
		</div>
	)
}
