'use client'

import { useEffect, useRef } from 'react'
import { type Message } from 'ai/react'

import { Button } from '@/core/components/ui/button'
import {
	Card,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import { ScrollArea, ScrollBar } from '@/core/components/ui/scroll-area'
import { Separator } from '@/core/components/ui/separator'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/core/components/ui/tooltip'
import { CirclePlus } from '@/core/lib/icons'

import { AiChatInput } from '@/features/chapters/student/components/chatbot/ai-chat-input'
import { AiChatMessage } from '@/features/chapters/student/components/chatbot/ai-chat-message'
import { AiChatTyping } from '@/features/chapters/student/components/chatbot/ai-chat-typing'

type AiChatCardProps = {
	messages: Message[]
	input: string
	handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
	isLoading: boolean
	setMessages: (messages: Message[]) => void
	initialMessages: Message[]
	user: {
		id: string
		imageUrl: string | null
		name: string | null
	}
}

export const AiChatCard = ({
	messages: chatMessages,
	input,
	handleInputChange,
	handleSubmit,
	isLoading,
	setMessages,
	initialMessages,
	user
}: AiChatCardProps) => {
	const messagesEndRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
			inline: 'nearest'
		})
	}, [chatMessages, isLoading])

	const handleReset = () => {
		setMessages(initialMessages)
	}

	return (
		<Card className="flex h-[24rem] flex-col lg:h-[30rem]">
			<CardHeader className="flex !max-h-11 flex-row items-center justify-between space-y-0 py-2">
				<CardTitle className="text-lg">Chapter AI Assistant</CardTitle>
				{chatMessages.length > 1 && (
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								onClick={handleReset}
								className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
							>
								<CirclePlus />
							</Button>
						</TooltipTrigger>
						<TooltipContent>New chat</TooltipContent>
					</Tooltip>
				)}
			</CardHeader>

			<Separator />

			<ScrollArea className="flex-1 overflow-y-auto px-4 focus:outline-none">
				<div className="space-y-1 py-4" ref={messagesEndRef}>
					{chatMessages
						.filter((message) => !message.toolInvocations)
						.map((message, index, array) => {
							const previousMessage = array[index - 1]
							const nextMessage = array[index + 1]
							const isFirstInSequence =
								index === 0 ||
								(previousMessage && previousMessage.role !== message.role)
							const isLastInSequence =
								index === array.length - 1 ||
								(nextMessage && nextMessage.role !== message.role)

							return (
								<AiChatMessage
									key={message.id}
									message={message}
									isLastInSequence={isLastInSequence}
									isFirstInSequence={isFirstInSequence}
									userData={{
										id: user?.id ?? '',
										imageUrl: user?.imageUrl ?? null,
										name: user?.name ?? null
									}}
								/>
							)
						})}
					{isLoading && <AiChatTyping />}
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>

			<CardFooter className="flex-none pt-4 md:px-4">
				<AiChatInput
					input={input}
					handleInputChange={handleInputChange}
					handleSubmit={handleSubmit}
				/>
			</CardFooter>
		</Card>
	)
}
