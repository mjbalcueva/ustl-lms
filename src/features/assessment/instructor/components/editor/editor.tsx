import * as React from 'react'
import { EditorContent, type Content } from '@tiptap/react'

import {
	useTiptapEditor,
	type UseTiptapEditorProps
} from '@/core/lib/hooks/use-tiptap'
import { cn } from '@/core/lib/utils/cn'

import { EditorToolbar } from '@/features/assessment/instructor/components/editor/editor-toolbar'

export type EditorProps = Omit<UseTiptapEditorProps, 'onUpdate'> & {
	value?: Content
	onUpdate?: (value: Content) => void
	className?: string
	editorContentClassName?: string
	inputClassName?: string
}

export const Editor = React.forwardRef<HTMLDivElement, EditorProps>(
	(
		{
			value,
			editable,
			onUpdate,
			className,
			editorContentClassName,
			inputClassName,
			...props
		},
		ref
	) => {
		const editor = useTiptapEditor({
			value,
			editable,
			onUpdate,
			...props
		})

		if (!editor) return 'Loading...'

		return (
			<div ref={ref} className={cn('space-y-1.5', className)}>
				<EditorToolbar editor={editor} inputClassName={inputClassName} />
				<EditorContent
					editor={editor}
					className={cn(
						'minimal-tiptap-editor',
						'min-h-20 rounded-xl border border-input px-3 py-2 shadow-sm outline-none ring-0 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background dark:bg-background',
						'[&_.is-editor-empty]:before:!text-muted-foreground',
						inputClassName,
						editorContentClassName
					)}
				/>
			</div>
		)
	}
)

Editor.displayName = 'MinimalTiptapEditor'
