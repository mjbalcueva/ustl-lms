'use client'

import * as React from 'react'

import { Button } from '@/core/components/ui/button'
import { Textarea } from '@/core/components/ui/textarea'
import { Send } from '@/core/lib/icons'

type ChatInputProps = {
	onSend: (content: string) => Promise<void>
	onTyping?: (isTyping: boolean) => void
	isLoading?: boolean
}

export function ChatInput({ onSend, onTyping, isLoading }: ChatInputProps) {
	const [content, setContent] = React.useState('')
	const typingTimeoutRef = React.useRef<NodeJS.Timeout>()

	const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			if (content.trim()) {
				await handleSend()
			}
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setContent(e.target.value)

		// Handle typing indicator
		if (onTyping) {
			onTyping(true)
			clearTimeout(typingTimeoutRef.current)
			typingTimeoutRef.current = setTimeout(() => {
				onTyping(false)
			}, 2000)
		}
	}

	const handleSend = async () => {
		if (!content.trim() || isLoading) return

		try {
			await onSend(content.trim())
			setContent('')
			onTyping?.(false)
		} catch (error) {
			console.error('Failed to send message:', error)
		}
	}

	React.useEffect(() => {
		return () => {
			clearTimeout(typingTimeoutRef.current)
		}
	}, [])

	return (
		<div className="fixed bottom-0 left-0 right-0 z-10 border-t bg-background p-4 md:relative">
			<div className="flex gap-2">
				<Textarea
					value={content}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					placeholder="Type a message..."
					rows={1}
					className="resize-none"
				/>
				<Button
					onClick={handleSend}
					disabled={!content.trim() || isLoading}
					size="icon"
				>
					<Send className="h-4 w-4" />
				</Button>
			</div>
		</div>
	)
}
