'use client'

import * as React from 'react'
import { EditorContent, type Content } from '@tiptap/react'

import { useTiptapEditor, type UseTiptapEditorProps } from '@/core/lib/hooks/use-tiptap'
import { cn } from '@/core/lib/utils/cn'

type TiptapContentViewerProps = Omit<UseTiptapEditorProps, 'onUpdate'> & {
	value?: Content
	className?: string
}

export const TiptapContentViewer = ({ value, className, ...props }: TiptapContentViewerProps) => {
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
TiptapContentViewer.displayName = 'TiptapContentViewer'
