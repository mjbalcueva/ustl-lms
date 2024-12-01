'use client'

import { useEffect, useRef, type FormEvent } from 'react'

import { Button } from '@/core/components/ui/button'
import { Textarea } from '@/core/components/ui/textarea'
import { Send } from '@/core/lib/icons'

type AiChatInputProps = {
	input: string
	handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
	handleSubmit: (e: FormEvent<HTMLFormElement>) => void
}

export const AiChatInput = ({
	input,
	handleInputChange,
	handleSubmit
}: AiChatInputProps) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const resetHeight = () => {
		const textarea = textareaRef.current
		if (!textarea) return
		textarea.style.height = 'auto'
		textarea.style.height = '40px'
	}

	const adjustHeight = () => {
		const textarea = textareaRef.current
		if (!textarea) return

		textarea.style.height = 'auto'
		const newHeight = Math.min(textarea.scrollHeight, 96)
		textarea.style.height = `${newHeight}px`
	}

	useEffect(() => {
		const textarea = textareaRef.current
		if (!textarea) return

		textarea.addEventListener('input', adjustHeight)
		return () => textarea.removeEventListener('input', adjustHeight)
	}, [])

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			const form = e.currentTarget.form
			if (form) {
				handleSubmit(
					new Event('submit') as unknown as FormEvent<HTMLFormElement>
				)
				resetHeight()
			}
		}
	}

	return (
		<form
			onSubmit={(e) => {
				handleSubmit(e)
				resetHeight()
			}}
			className="flex w-full items-end gap-2.5"
		>
			<Textarea
				ref={textareaRef}
				value={input}
				onChange={handleInputChange}
				name="ai-chat-message"
				placeholder="Type your message..."
				className="min-h-10 resize-none"
				rows={1}
				onKeyDown={handleKeyDown}
			/>
			<Button type="submit" className="shrink-0" size="icon">
				<Send />
			</Button>
		</form>
	)
}
