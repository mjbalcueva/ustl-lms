'use client'

import { useState } from 'react'

import { Button } from '@/core/components/ui/button'
import { Textarea } from '@/core/components/ui/textarea'
import { Send } from '@/core/lib/icons'

type AiChatInputProps = {
	onSendMessage: (message: string) => void
}

export function AiChatInput({ onSendMessage }: AiChatInputProps) {
	const [message, setMessage] = useState('')

	const handleSendMessage = () => {
		if (message.trim()) {
			onSendMessage(message)
			setMessage('')
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSendMessage()
		}
	}

	return (
		<div className="flex items-end gap-2">
			<Textarea
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				onKeyDown={handleKeyPress}
				placeholder="Ask me anything..."
				className="flex-grow resize-none"
				rows={2}
			/>
			<Button onClick={handleSendMessage} size="icon">
				<Send />
			</Button>
		</div>
	)
}
