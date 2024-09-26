import { type Editor } from '@tiptap/react'

import { ClearColorHighlight } from '@/client/components/tiptap//clear-color-highlight'
import { UpdateTextHighlight } from '@/client/components/tiptap//update-text-highlight'
import { UpdateTextColor } from '@/client/components/tiptap/update-text-color'
import { UpdateTextFormating } from '@/client/components/tiptap/update-text-formating'
import { UpdateTextStyle } from '@/client/components/tiptap/update-text-style'
import { Separator } from '@/client/components/ui'

export const EditorToolbar = ({ editor }: { editor: Editor }) => (
	<div className="shrink-0 overflow-x-auto rounded-xl border border-input">
		<div className="flex w-max items-center gap-px space-x-1 p-1">
			<UpdateTextStyle editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />
			<Separator orientation="vertical" className="h-7" />
			<UpdateTextFormating editor={editor} />
			<Separator orientation="vertical" className="h-7" />
			<UpdateTextColor editor={editor} />
			<UpdateTextHighlight editor={editor} />
			<ClearColorHighlight editor={editor} />
		</div>
	</div>
)
