import { Avatar, AvatarFallback, AvatarImage } from '@/core/components/ui/avatar'
import { Dot } from '@/core/lib/icons'

export function AiChatTyping() {
	return (
		<div className="flex gap-2">
			<div className="flex flex-col justify-end">
				<Avatar className="size-9 border">
					<AvatarImage src="/assets/ai-avatar.jpg" alt="AI" />
					<AvatarFallback>AI</AvatarFallback>
				</Avatar>
			</div>
			<div className="group flex flex-col">
				<div className="rounded-2xl rounded-bl-md bg-muted p-3">
					<div className="flex -space-x-2.5">
						<Dot className="animate-typing-dot-bounce h-5 w-5" />
						<Dot className="animate-typing-dot-bounce h-5 w-5 [animation-delay:90ms]" />
						<Dot className="animate-typing-dot-bounce h-5 w-5 [animation-delay:180ms]" />
					</div>
				</div>
			</div>
		</div>
	)
}
