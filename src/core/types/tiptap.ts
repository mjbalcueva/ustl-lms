import { type Editor } from '@tiptap/core'

export type FormatAction = {
	label: string
	icon?: React.ReactNode
	action: (editor: Editor) => void
	isActive: (editor: Editor) => boolean
	canExecute: (editor: Editor) => boolean
	shortcuts: string[]
	value: string
}
