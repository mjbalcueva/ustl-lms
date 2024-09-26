import * as React from 'react'
import type { Editor } from '@tiptap/react'
import { TbHighlightOff } from 'react-icons/tb'

import { EditorToolbarButton } from '@/client/components/tiptap/editor-toolbar-button'
import { Popover, PopoverContent, PopoverTrigger } from '@/client/components/ui'

type ClearHighlightColorProps = {
	editor: Editor
	size?: string
	variant?: string
}

export const ClearColorHighlight: React.FC<ClearHighlightColorProps> = ({ editor, size, variant }) => {
	const handleClear = React.useCallback(() => {
		editor.chain().focus().unsetHighlight().unsetColor().run()
	}, [editor])

	return (
		<Popover>
			<PopoverTrigger asChild>
				<EditorToolbarButton
					tooltip="Clear highlight and color"
					aria-label="Clear highlight and color"
					size={(size as 'default' | 'xs' | 'sm' | 'lg' | undefined) ?? 'xs'}
					variant={(variant as 'default' | 'outline' | undefined) ?? 'default'}
				>
					<TbHighlightOff className="size-5" />
				</EditorToolbarButton>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-full">
				<div className="space-y-1.5">
					<button onClick={handleClear} className="w-full text-left">
						Clear highlight and color
					</button>
				</div>
			</PopoverContent>
		</Popover>
	)
}
