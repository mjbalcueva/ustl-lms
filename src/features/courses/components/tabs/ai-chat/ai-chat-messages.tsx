import ReactMarkdown from 'react-markdown'

import { Avatar, AvatarFallback, AvatarImage } from '@/core/components/ui/avatar'

type Message = {
	id: string
	content: string
	sender: 'user' | 'ai'
	timestamp: string
}

type AiChatMessagesProps = {
	messages: Message[]
}

export function AiChatMessages({ messages }: AiChatMessagesProps) {
	return (
		<div className="space-y-4">
			{messages.map((message) => (
				<div
					key={message.id}
					className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
				>
					<div
						className={`flex ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} max-w-[80%] gap-2`}
					>
						<Avatar className="h-8 w-8">
							{message.sender === 'ai' ? (
								<AvatarImage src="/ai-avatar.png" alt="AI" />
							) : (
								<AvatarImage src="/user-avatar.png" alt="User" />
							)}
							<AvatarFallback>{message.sender === 'ai' ? 'AI' : 'U'}</AvatarFallback>
						</Avatar>
						<div
							className={`rounded-lg p-3 ${
								message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
							}`}
						>
							<ReactMarkdown className="prose dark:prose-invert max-w-none">
								{message.content}
							</ReactMarkdown>
							<div className="mt-1 text-xs text-muted-foreground">{message.timestamp}</div>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
