import { type Editor } from '@tiptap/react'

import { UpdateTextStyle } from '@/client/components/tiptap/update-text-style'

export const EditorToolbar = ({ editor }: { editor: Editor }) => (
	<div className="shrink-0 overflow-x-auto rounded-xl border border-input">
		<div className="flex w-max items-center gap-px p-1">
			<UpdateTextStyle editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />
		</div>
	</div>
)
