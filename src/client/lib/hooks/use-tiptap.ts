import * as React from 'react'
import type { AnyExtension, Editor } from '@tiptap/core'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import { Typography } from '@tiptap/extension-typography'
import type { Content, UseEditorOptions } from '@tiptap/react'
import { useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'

import { useTiptapThrottle } from '@/client/lib/hooks/use-tiptap-throttle'
import { BackgroundColor } from '@/client/lib/tiptap/extensions/background-color'
import { CodeBlockLowlight } from '@/client/lib/tiptap/extensions/code-block-low-light'
import { Color } from '@/client/lib/tiptap/extensions/color'
import { HorizontalRule } from '@/client/lib/tiptap/extensions/horizontal-rule'
import { Image } from '@/client/lib/tiptap/extensions/image'
import { Link } from '@/client/lib/tiptap/extensions/link'
import { ResetMarksOnEnter } from '@/client/lib/tiptap/extensions/reset-marks-on-enter'
import { Selection } from '@/client/lib/tiptap/extensions/selection'
import { UnsetAllMarks } from '@/client/lib/tiptap/extensions/unset-all-marks'
import { cn, getOutput } from '@/client/lib/utils'

export type UseTiptapEditorProps = UseEditorOptions & {
	value?: Content
	output?: 'html' | 'json' | 'text'
	placeholder?: string
	editorClassName?: string
	throttleDelay?: number
	onUpdate?: (content: Content) => void
	onBlur?: (content: Content) => void
}

const createExtensions = (placeholder: string) => [
	StarterKit.configure({
		horizontalRule: false,
		codeBlock: false,
		paragraph: { HTMLAttributes: { class: 'text-node' } },
		heading: { HTMLAttributes: { class: 'heading-node' } },
		blockquote: { HTMLAttributes: { class: 'block-node' } },
		bulletList: { HTMLAttributes: { class: 'list-node' } },
		orderedList: { HTMLAttributes: { class: 'list-node' } },
		code: { HTMLAttributes: { class: 'inline', spellcheck: 'false' } },
		dropcursor: { width: 2, class: 'ProseMirror-dropcursor border' }
	}),
	Link,
	Image,
	BackgroundColor,
	Color,
	TextStyle,
	Selection,
	Typography,
	UnsetAllMarks,
	HorizontalRule,
	ResetMarksOnEnter,
	CodeBlockLowlight,
	Placeholder.configure({ placeholder: () => placeholder })
]

export const useTiptapEditor = ({
	value,
	output = 'html',
	placeholder = '',
	editorClassName,
	throttleDelay = 1000,
	onUpdate,
	onBlur,
	...props
}: UseTiptapEditorProps) => {
	const throttledSetValue = useTiptapThrottle((value: Content) => onUpdate?.(value), throttleDelay)

	const handleUpdate = React.useCallback(
		(editor: Editor) => throttledSetValue(getOutput(editor, output)),
		[output, throttledSetValue]
	)

	const handleCreate = React.useCallback(
		(editor: Editor) => {
			if (value && editor.isEmpty) {
				editor.commands.setContent(value)
			}
		},
		[value]
	)

	const handleBlur = React.useCallback((editor: Editor) => onBlur?.(getOutput(editor, output)), [output, onBlur])

	const editor = useEditor({
		extensions: createExtensions(placeholder) as AnyExtension[],
		editorProps: {
			attributes: {
				autocomplete: 'off',
				autocorrect: 'off',
				autocapitalize: 'off',
				class: cn('focus:outline-none', editorClassName)
			}
		},
		onUpdate: ({ editor }) => handleUpdate(editor),
		onCreate: ({ editor }) => handleCreate(editor),
		onBlur: ({ editor }) => handleBlur(editor),
		...props
	})

	return editor
}
