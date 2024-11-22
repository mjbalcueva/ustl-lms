import { type Message } from 'ai'

import { Avatar, AvatarFallback, AvatarImage } from '@/core/components/ui/avatar'
import { MarkdownRenderer } from '@/core/components/ui/markdown-renderer'
import { cn } from '@/core/lib/utils/cn'

type AiChatMessageProps = {
	message: Message
}

export function AiChatMessage({ message }: AiChatMessageProps) {
	return (
		<div className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}>
			<div
				className={cn(
					'flex max-w-[80%] items-end gap-2',
					message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
				)}
			>
				<Avatar className="mb-4 size-8">
					{message.role === 'assistant' ? (
						<AvatarImage src="/ai-avatar.png" alt="AI" />
					) : (
						<AvatarImage src="/user-avatar.png" alt="User" />
					)}
					<AvatarFallback>{message.role === 'assistant' ? 'AI' : 'U'}</AvatarFallback>
				</Avatar>

				<div className="group flex flex-col space-y-0.5">
					<div
						className={cn(
							'rounded-2xl p-3',
							message.role === 'user'
								? 'rounded-br-md bg-primary text-primary-foreground'
								: 'rounded-bl-md bg-muted'
						)}
					>
						<MarkdownRenderer>{message.content}</MarkdownRenderer>
					</div>

					<div
						className={cn(
							'text-xs text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100',
							message.role === 'assistant' ? 'ml-1' : 'mr-1 text-right'
						)}
					>
						{message.createdAt?.toLocaleTimeString()}
					</div>
				</div>
			</div>
		</div>
	)
}
