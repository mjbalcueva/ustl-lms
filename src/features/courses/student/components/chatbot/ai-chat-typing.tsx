import { Avatar, AvatarFallback, AvatarImage } from '@/core/components/ui/avatar'
import { Dot } from '@/core/lib/icons'

export function AiChatTyping() {
	return (
		<div className="flex gap-2 pt-3">
			<div className="flex flex-col justify-end">
				<Avatar className="size-9 border">
					<AvatarImage src="/assets/ai-avatar.jpg" alt="AI" />
					<AvatarFallback>AI</AvatarFallback>
				</Avatar>
			</div>
			<div className="group flex flex-col">
				<div className="rounded-2xl rounded-bl-md bg-muted px-3 py-2">
					<div className="flex -space-x-2.5">
						<Dot className="h-5 w-5 animate-typing-dot-bounce" />
						<Dot className="h-5 w-5 animate-typing-dot-bounce [animation-delay:90ms]" />
						<Dot className="h-5 w-5 animate-typing-dot-bounce [animation-delay:180ms]" />
					</div>
				</div>
			</div>
		</div>
	)
}
