import { type Editor } from '@tiptap/core'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { type TiptapEditorProps } from '@/client/components/tiptap-editor'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
	return name
		.split(' ')
		.filter((n) => n)
		.map((n) => n[0])
		.join('')
		.substring(0, 2)
}

export function getEmail(email: string) {
	return `${email.split('@')[0]}`
}

// Tiptap

export function getOutput(editor: Editor, format: TiptapEditorProps['output']) {
	if (format === 'json') {
		return editor.getJSON()
	}

	if (format === 'html') {
		return editor.getText() ? editor.getHTML() : ''
	}

	return editor.getText()
}
