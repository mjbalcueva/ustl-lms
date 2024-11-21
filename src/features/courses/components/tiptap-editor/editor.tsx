'use client'

import * as React from 'react'
import { EditorContent, type Content } from '@tiptap/react'

import { useTiptapEditor, type UseTiptapEditorProps } from '@/core/lib/hooks/use-tiptap'
import { cn } from '@/core/lib/utils/cn'

export type TiptapEditorProps = Omit<UseTiptapEditorProps, 'onUpdate'> & {
	value?: Content
	className?: string
}

export const TiptapEditor = ({ value, className, ...props }: TiptapEditorProps) => {
	const editor = useTiptapEditor({
		value,
		editable: false,
		immediatelyRender: false,
		...props
	})

	if (!editor) return 'Loading...'

	return (
		<EditorContent
			editor={editor}
			className={cn('minimal-tiptap-editor', 'cursor-default', className)}
		/>
	)
}
TiptapEditor.displayName = 'MinimalTiptapEditor'
