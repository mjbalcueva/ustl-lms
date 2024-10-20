import * as React from 'react'
import { type AnyExtension, type Editor } from '@tiptap/core'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import { Typography } from '@tiptap/extension-typography'
import { useEditor, type Content, type UseEditorOptions } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'

import { useTiptapThrottle } from '@/core/lib/hooks/use-tiptap-throttle'
import { CodeBlockLowlight } from '@/core/lib/tiptap-editor/extensions/code-block-low-light'
import { Color } from '@/core/lib/tiptap-editor/extensions/color'
import { Highlight } from '@/core/lib/tiptap-editor/extensions/highlight'
import { HorizontalRule } from '@/core/lib/tiptap-editor/extensions/horizontal-rule'
import { Image } from '@/core/lib/tiptap-editor/extensions/image'
import { Link } from '@/core/lib/tiptap-editor/extensions/link'
import { ResetMarksOnEnter } from '@/core/lib/tiptap-editor/extensions/reset-marks-on-enter'
import { Selection } from '@/core/lib/tiptap-editor/extensions/selection'
import { UnsetAllMarks } from '@/core/lib/tiptap-editor/extensions/unset-all-marks'
import { cn } from '@/core/lib/utils/cn'
import { getOutput } from '@/core/lib/utils/get-output'

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
	Color,
	Highlight.configure({
		multicolor: true
	}),
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

	const handleBlur = React.useCallback(
		(editor: Editor) => onBlur?.(getOutput(editor, output)),
		[output, onBlur]
	)

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
