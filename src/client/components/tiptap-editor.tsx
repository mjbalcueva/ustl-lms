import * as React from 'react'
import { EditorContent } from '@tiptap/react'
import type { Content } from '@tiptap/react'

import { useTiptapEditor, type UseTiptapEditorProps } from '@/client/lib/hooks/use-tiptap'
import { cn } from '@/client/lib/utils'

export interface TiptapEditorProps extends Omit<UseTiptapEditorProps, 'onUpdate'> {
	value?: Content
	onChange?: (value: Content) => void
	className?: string
	editorContentClassName?: string
}

export const TiptapEditor = React.forwardRef<HTMLDivElement, TiptapEditorProps>(
	({ value, onChange, className, editorContentClassName, ...props }, ref) => {
		const editor = useTiptapEditor({
			value,
			onUpdate: onChange,
			...props
		})

		if (!editor) return null

		return (
			<div ref={ref} className={cn('space-y-2', className)}>
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
