import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@/core/components/ui/avatar'
import { MarkdownRenderer } from '@/core/components/ui/markdown-renderer'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/core/components/ui/tooltip'
import { cn } from '@/core/lib/utils/cn'
import { getDayOfWeek } from '@/core/lib/utils/format-date'
import { formatTime } from '@/core/lib/utils/format-time'

type Message = {
	id: string
	content: string
	senderId: string
	senderName: string
	senderImage: string | null | undefined
	createdAt: Date
}

type ChatMessageProps = {
	message: Message
	currentUserId: string
	isLastInSequence?: boolean
	isFirstInSequence?: boolean
}

export function ChatMessage({
	message,
	currentUserId,
	isLastInSequence = true,
	isFirstInSequence = false
}: ChatMessageProps) {
	const isCurrentUser = message.senderId === currentUserId
	const isAssistant = message.senderId === 'assistant'
	const timestamp = message.createdAt
		? `${getDayOfWeek(message.createdAt)} ${formatTime(message.createdAt)}`
		: ''

	return (
		<div
			className={cn(
				'group flex',
				isCurrentUser ? 'justify-end' : 'justify-start'
			)}
		>
			<div
				className={cn(
					'flex max-w-[80%] items-end gap-2',
					isCurrentUser ? 'flex-row-reverse' : 'flex-row',
					!isLastInSequence && 'mx-11'
				)}
			>
				{isLastInSequence && (
					<Avatar className="size-9 border">
						{isAssistant ? (
							<AvatarImage src="/assets/ai-avatar.jpg" alt="AI Assistant" />
						) : (
							<AvatarImage
								src={message.senderImage ?? ''}
								alt={`${message.senderName}'s avatar`}
							/>
						)}
						<AvatarFallback>
							{isAssistant
								? 'AI'
								: (message.senderName?.[0]?.toUpperCase() ?? '?')}
						</AvatarFallback>
					</Avatar>
				)}

				<Tooltip>
					<TooltipTrigger asChild>
						<div
							className={cn(
								'px-3 py-2 transition-colors',
								isCurrentUser
									? cn(
											'bg-primary text-primary-foreground hover:bg-primary/90',
											isLastInSequence && 'rounded-2xl rounded-r-md',
											!isLastInSequence &&
												'rounded-2xl rounded-br-md rounded-tr-md',
											isFirstInSequence && 'mt-3 rounded-2xl rounded-br-md'
										)
									: cn(
											'bg-muted hover:bg-muted/90',
											isLastInSequence && 'rounded-2xl rounded-l-md',
											!isLastInSequence &&
												'rounded-2xl rounded-bl-md rounded-tl-md',
											isFirstInSequence && 'mt-3 rounded-2xl rounded-bl-md'
										)
							)}
							aria-label={`Message from ${message.senderName} at ${timestamp}`}
						>
							<MarkdownRenderer>{message.content}</MarkdownRenderer>
						</div>
					</TooltipTrigger>
					<TooltipContent
						align="start"
						className="rounded-2xl bg-popover/75 backdrop-blur-sm"
						aria-label="Message timestamp"
					>
						{timestamp}
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	)
}
