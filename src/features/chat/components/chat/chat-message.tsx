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

export type Message = {
	id: string
	content: string
	senderId: string
	senderName: string
	senderImage: string | null | undefined
	createdAt: Date
	readBy?: {
		id: string
		name: string | null
		image: string | null
	}[]
	isLastReadByUser?: boolean
}

type ChatMessageProps = {
	message: Message
	currentUserId: string
	isLastInSequence?: boolean
	isFirstInSequence?: boolean
	showTimestamp?: boolean
}

export function ChatMessage({
	message,
	currentUserId,
	isLastInSequence = true,
	isFirstInSequence = false,
	showTimestamp = false
}: ChatMessageProps) {
	const isCurrentUser = message.senderId === currentUserId
	const isAssistant = message.senderId === 'assistant'
	const timestamp = message.createdAt
		? `${getDayOfWeek(message.createdAt)} ${formatTime(message.createdAt)}`
		: ''

	return (
		<>
			{showTimestamp && (
				<div className="!my-4 flex justify-center">
					<span className="text-xs font-medium text-muted-foreground">
						{timestamp}
					</span>
				</div>
			)}

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
						!isLastInSequence && !isCurrentUser && 'ml-10'
					)}
				>
					{isLastInSequence && !isCurrentUser && (
						<Avatar className="size-8 border">
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

					<div className="flex flex-col gap-1">
						<Tooltip delayDuration={200}>
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
								side="top"
								align={isCurrentUser ? 'end' : 'start'}
								className="rounded-xl bg-popover/75 px-3 py-1.5 text-sm backdrop-blur-sm"
							>
								{timestamp}
							</TooltipContent>
						</Tooltip>

						{isCurrentUser &&
							message.isLastReadByUser &&
							message.readBy &&
							message.readBy.length > 0 && (
								<div className="flex justify-end">
									<div className="flex cursor-pointer -space-x-2">
										{message.readBy.slice(0, 3).map((reader) => (
											<Tooltip key={reader.id} delayDuration={200}>
												<TooltipTrigger asChild>
													<Avatar className="size-4 border border-background">
														<AvatarImage
															src={reader.image ?? ''}
															alt={`${reader.name}'s avatar`}
														/>
														<AvatarFallback className="text-[8px]">
															{reader.name?.[0]?.toUpperCase() ?? '?'}
														</AvatarFallback>
													</Avatar>
												</TooltipTrigger>
												<TooltipContent
													side="top"
													align="center"
													className="rounded-xl bg-popover/75 px-3 py-1.5 text-sm backdrop-blur-sm"
												>
													Seen by {reader.name} at{' '}
													{formatTime(message.createdAt)}
												</TooltipContent>
											</Tooltip>
										))}
										{message.readBy.length > 3 && (
											<Tooltip delayDuration={200}>
												<TooltipTrigger asChild>
													<div className="flex size-4 items-center justify-center rounded-full border border-background bg-muted text-[8px]">
														+{message.readBy.length - 3}
													</div>
												</TooltipTrigger>
												<TooltipContent
													side="top"
													align="center"
													className="rounded-xl bg-popover/75 px-3 py-1.5 text-sm backdrop-blur-sm"
												>
													<div className="space-y-1">
														{message.readBy.slice(3).map((reader) => (
															<div key={reader.id}>{reader.name}</div>
														))}
													</div>
												</TooltipContent>
											</Tooltip>
										)}
									</div>
								</div>
							)}
					</div>
				</div>
			</div>
		</>
	)
}
