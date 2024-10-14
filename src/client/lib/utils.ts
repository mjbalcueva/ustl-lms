import { type Editor } from '@tiptap/core'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { type TiptapEditorProps } from '@/client/components/tiptap-editor'

/**
 * Merges multiple class values into a single string.
 * @param inputs - The class values to merge.
 * @returns The merged class string.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/**
 * Capitalizes the first letter of a string and lowercases the rest.
 * @param str - The input string to be formatted.
 * @returns The formatted string with the first letter capitalized and the rest lowercased.
 */
export function capitalize(str: string): string {
	return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str
}

/**
 * Extracts the initials from a name.
 * @param name - The name to extract initials from.
 * @returns The initials extracted from the name.
 */
export function getInitials(name: string) {
	return name
		.split(' ')
		.filter((n) => n)
		.map((n) => n[0])
		.join('')
		.substring(0, 2)
}

/**
 * Extracts the username from an email address.
 * @param email - The email address to extract the username from.
 * @returns The username extracted from the email address.
 */
export function getEmail(email: string) {
	return `${email.split('@')[0]}`
}

/**
 * Formats the content of a Tiptap editor based on the specified format.
 * @param editor - The Tiptap editor instance.
 * @param format - The format of the output.
 * @returns The formatted content.
 */
export function getOutput(editor: Editor, format: TiptapEditorProps['output']) {
	if (format === 'json') {
		return editor.getJSON()
	}

	if (format === 'html') {
		return editor.getText() ? editor.getHTML() : ''
	}

	return editor.getText()
}

/**
 * Formats a date according to the specified options.
 * @param date - The date to format.
 * @param opts - The options for formatting the date.
 * @returns The formatted date string.
 */
export function formatDate(date: Date | string | number, opts: Intl.DateTimeFormatOptions = {}) {
	return new Intl.DateTimeFormat('en-US', {
		month: opts.month ?? 'long',
		day: opts.day ?? 'numeric',
		year: opts.year ?? 'numeric',
		...opts
	}).format(new Date(date))
}
