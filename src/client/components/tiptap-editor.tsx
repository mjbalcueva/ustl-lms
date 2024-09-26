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
	({ value, editable, onUpdate, className, editorContentClassName, ...props }, ref) => {
		const editor = useTiptapEditor({
			value,
			editable,
			onUpdate,
			...props
		})

		if (!editor) return null

		if (!editable) return <EditorContent editor={editor} className={cn('minimal-tiptap-editor', 'cursor-default')} />

		return (
			<div ref={ref} className={cn('space-y-1.5', className)}>
				<EditorToolbar editor={editor} />
				<EditorContent
					editor={editor}
					className={cn(
						'minimal-tiptap-editor',
						'min-h-20 rounded-xl border border-input px-3 py-2 shadow-sm outline-none ring-0 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background dark:bg-background',
						editorContentClassName
					)}
				/>
			</div>
		)
	}
)

TiptapEditor.displayName = 'MinimalTiptapEditor'
