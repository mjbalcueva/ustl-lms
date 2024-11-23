import { type Message } from 'ai'

import { Avatar, AvatarFallback, AvatarImage } from '@/core/components/ui/avatar'
import { MarkdownRenderer } from '@/core/components/ui/markdown-renderer'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/core/components/ui/tooltip'
import { cn } from '@/core/lib/utils/cn'
import { getDayOfWeek } from '@/core/lib/utils/format-date'
import { formatTime } from '@/core/lib/utils/format-time'

type AiChatMessageProps = {
	message: Message
	userData: {
		id: string
		imageUrl: string | null
		name: string | null
	}
	isLastInSequence?: boolean
	isFirstInSequence?: boolean
}

export function AiChatMessage({
	message,
	userData,
	isLastInSequence = true,
	isFirstInSequence = false
}: AiChatMessageProps) {
	return (
		<div className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}>
			<div
				className={cn(
					'flex max-w-[80%] items-end gap-2',
					message.role === 'user' ? 'flex-row-reverse' : 'flex-row',
					!isLastInSequence && 'mx-11'
				)}
			>
				{isLastInSequence && (
					<Avatar className="size-9 border">
						{message.role === 'assistant' ? (
							<AvatarImage src="/assets/ai-avatar.jpg" alt="AI" />
						) : (
							<AvatarImage src={userData.imageUrl ?? ''} alt={userData.name ?? ''} />
						)}
						<AvatarFallback>{message.role === 'assistant' ? 'AI' : userData.name}</AvatarFallback>
					</Avatar>
				)}

				<Tooltip>
					<TooltipTrigger asChild>
						<div
							className={cn(
								'px-3 py-2',
								message.role === 'user'
									? cn(
											'bg-primary text-primary-foreground',
											isLastInSequence && 'rounded-2xl rounded-r-md',
											!isLastInSequence && 'rounded-2xl rounded-br-md rounded-tr-md',
											isFirstInSequence && 'mt-3 rounded-2xl rounded-br-md'
										)
									: cn(
											'bg-muted',
											isLastInSequence && 'rounded-2xl rounded-l-md',
											!isLastInSequence && 'rounded-2xl rounded-bl-md rounded-tl-md',
											isFirstInSequence && 'mt-3 rounded-2xl rounded-bl-md'
										)
							)}
						>
							<MarkdownRenderer>{message.content}</MarkdownRenderer>
						</div>
					</TooltipTrigger>
					<TooltipContent align="start" className="rounded-2xl bg-popover/75 backdrop-blur-sm">
						{message.createdAt
							? `${getDayOfWeek(message.createdAt)} ${formatTime(message.createdAt)}`
							: ''}
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	)
}
