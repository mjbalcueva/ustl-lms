import * as React from 'react'
import { EditorContent } from '@tiptap/react'
import type { Content } from '@tiptap/react'

import { EditorToolbar } from '@/client/components/tiptap/editor-toolbar'
import { useTiptapEditor, type UseTiptapEditorProps } from '@/client/lib/hooks/use-tiptap'
import { cn } from '@/client/lib/utils'

export type TiptapEditorProps = Omit<UseTiptapEditorProps, 'onUpdate'> & {
	value?: Content
	onUpdate?: (value: Content) => void
	className?: string
	editorContentClassName?: string
}

export const TiptapEditor = React.forwardRef<HTMLDivElement, TiptapEditorProps>(
	({ value, onUpdate, className, editorContentClassName, ...props }, ref) => {
		const editor = useTiptapEditor({
			value,
			onUpdate,
			...props
		})

		if (!editor) return null

		return (
			<div ref={ref} className={cn('space-y-2', className)}>
				<EditorToolbar editor={editor} />
				<EditorContent
					editor={editor}
					className={cn(
						'dark-bg-background min-h-20 rounded-xl border border-input px-3 py-2 shadow-sm',
						editorContentClassName
					)}
				/>
			</div>
		)
	}
)

TiptapEditor.displayName = 'MinimalTiptapEditor'
