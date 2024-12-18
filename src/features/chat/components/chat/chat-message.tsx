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
	senderName: string | null
	senderImage: string | null
	createdAt: Date
	chatId: string
	type: 'direct' | 'group'
	readBy?: {
		id: string
		name: string | null
		image: string | null
	}[]
	isLastReadByUser?: boolean
	messageIndex?: number
}

type GroupMessageSender = {
	groupChatMemberId: string
	userId: string
	groupChatId: string
	role: string
	user: {
		id: string
		profile?: {
			name: string | null
			imageUrl: string | null
		} | null
	}
}

type DirectMessageSender = {
	profile?: {
		name: string | null
		imageUrl: string | null
	} | null
}

type RawMessage = {
	directChatMessageId?: string
	groupChatMessageId?: string
	content: string
	senderId: string
	createdAt: Date
	sender: GroupMessageSender | DirectMessageSender
	readBy?: Array<{
		userId: string
		user: {
			profile: {
				name: string | null
				imageUrl: string | null
			} | null
		} | null
	}>
	isLastReadByUser?: boolean
	groupChatId?: string
	directChatId?: string
}

export function formatMessage(
	message: RawMessage,
	type: 'direct' | 'group',
	messageIndex?: number
): Message {
	if (type === 'group') {
		const sender = message.sender as GroupMessageSender
		return {
			id: message.groupChatMessageId ?? 'unknown',
			content: message.content,
			senderId: sender.userId,
			senderName: sender.user.profile?.name ?? 'Unknown',
			senderImage: sender.user.profile?.imageUrl ?? null,
			createdAt: message.createdAt,
			chatId: message.groupChatId ?? 'unknown',
			type: 'group',
			readBy:
				message.readBy?.map((read) => ({
					id: read.userId,
					name: read.user?.profile?.name ?? null,
					image: read.user?.profile?.imageUrl ?? null
				})) ?? [],
			isLastReadByUser: message.isLastReadByUser ?? false,
			messageIndex
		}
	}

	// Direct message format
	const sender = message.sender as DirectMessageSender
	return {
		id: message.directChatMessageId ?? 'unknown',
		content: message.content,
		senderId: message.senderId,
		senderName: sender.profile?.name ?? 'Unknown',
		senderImage: sender.profile?.imageUrl ?? null,
		createdAt: message.createdAt,
		chatId: message.directChatId ?? 'unknown',
		type: type,
		readBy:
			message.readBy?.map((read) => ({
				id: read.userId,
				name: read.user?.profile?.name ?? null,
				image: read.user?.profile?.imageUrl ?? null
			})) ?? [],
		isLastReadByUser: message.isLastReadByUser ?? false,
		messageIndex
	}
}

type ChatMessageProps = {
	message: Message
	currentUserId: string
	type: 'direct' | 'group'
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

	// Show read receipts for this message (excluding current user)
	const readByUsers = (message.readBy ?? []).filter(
		(reader) => reader.id !== currentUserId
	)

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
				<div className="flex w-full flex-col">
					<div
						className={cn(
							'flex',
							isCurrentUser ? 'justify-end' : 'justify-start'
						)}
					>
						<div
							className={cn(
								'flex max-w-[80%] items-end gap-2',
								isCurrentUser ? 'flex-row-reverse' : 'flex-row'
							)}
						>
							{!isLastInSequence && !isCurrentUser && (
								<span className="min-w-8"></span>
							)}

							{isLastInSequence && !isCurrentUser && (
								<Tooltip delayDuration={200}>
									<TooltipTrigger asChild>
										<Avatar className="size-8 border">
											{isAssistant ? (
												<AvatarImage
													src="/assets/ai-avatar.jpg"
													alt="AI Assistant"
												/>
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
									</TooltipTrigger>
									<TooltipContent
										side="top"
										align={isCurrentUser ? 'end' : 'start'}
										className="rounded-xl bg-popover/75 px-3 py-1.5 text-sm backdrop-blur-sm"
									>
										{message.senderName}
									</TooltipContent>
								</Tooltip>
							)}

							<Tooltip delayDuration={200}>
								<TooltipTrigger asChild>
									<div
										className={cn(
											'flex min-h-[34px] items-center px-3 py-1.5 transition-colors',
											isCurrentUser
												? cn(
														'bg-primary text-primary-foreground hover:bg-primary/90',
														isLastInSequence && 'rounded-2xl rounded-tr-md',
														!isLastInSequence &&
															'rounded-2xl rounded-br-md rounded-tr-md',
														isFirstInSequence &&
															'mt-3 rounded-2xl rounded-br-md'
													)
												: cn(
														'bg-muted hover:bg-muted/90',
														isLastInSequence && 'rounded-2xl rounded-tl-md',
														!isLastInSequence &&
															'rounded-2xl rounded-bl-md rounded-tl-md',
														isFirstInSequence &&
															'mt-3 rounded-2xl rounded-bl-md'
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
						</div>
					</div>

					{readByUsers.length > 0 && (
						<div className="mt-1 flex items-center justify-end gap-0.5">
							{readByUsers.slice(0, 3).map((reader) => (
								<Tooltip key={reader.id} delayDuration={200}>
									<TooltipTrigger asChild>
										<Avatar className="!size-5 border border-background">
											<AvatarImage
												src={reader.image ?? ''}
												alt={`${reader.name}'s avatar`}
											/>
											<AvatarFallback className="text-[10px]">
												{reader.name?.[0]?.toUpperCase() ?? '?'}
											</AvatarFallback>
										</Avatar>
									</TooltipTrigger>
									<TooltipContent
										side="top"
										align="center"
										className="rounded-xl bg-popover/75 px-3 py-1.5 text-sm backdrop-blur-sm"
									>
										Seen by {reader.name} at {formatTime(message.createdAt)}
									</TooltipContent>
								</Tooltip>
							))}

							{readByUsers.length > 3 && (
								<Tooltip delayDuration={200}>
									<TooltipTrigger asChild>
										<div className="flex !size-5 items-center justify-center rounded-full border border-background bg-muted text-[8px]">
											+{readByUsers.length - 3}
										</div>
									</TooltipTrigger>
									<TooltipContent
										side="top"
										align="center"
										className="rounded-xl bg-popover/75 px-3 py-1.5 text-sm backdrop-blur-sm"
									>
										<div className="space-y-1">
											{readByUsers.slice(3).map((reader) => (
												<div key={reader.id}>{reader.name}</div>
											))}
										</div>
									</TooltipContent>
								</Tooltip>
							)}
						</div>
					)}
				</div>
			</div>
		</>
	)
}
