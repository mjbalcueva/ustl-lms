import * as React from 'react'
import { type Editor } from '@tiptap/react'

import { EditorToolbarButton } from '@/core/components/tiptap-editor/editor-toolbar-button'
import { ClearHighlight } from '@/core/lib/icons'

type ClearHighlightColorProps = {
	editor: Editor
	size?: string
	variant?: string
}

export const ClearColorHighlight: React.FC<ClearHighlightColorProps> = ({
	editor,
	size,
	variant
}) => {
	const handleClear = React.useCallback(() => {
		editor.chain().focus().unsetHighlight().unsetColor().run()
	}, [editor])

	return (
		<EditorToolbarButton
			tooltip="Clear highlight and color"
			aria-label="Clear highlight and color"
			size={(size as 'default' | 'xs' | 'sm' | 'lg' | undefined) ?? 'xs'}
			variant={(variant as 'default' | 'outline' | undefined) ?? 'default'}
			onClick={handleClear}
		>
			<ClearHighlight className="size-5" />
		</EditorToolbarButton>
	)
}
