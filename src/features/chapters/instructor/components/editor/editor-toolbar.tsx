import { type Editor } from '@tiptap/react'

import { ClearColorHighlight } from '@/core/components/tiptap-editor/clear-color-highlight'
import { UpdateTextColor } from '@/core/components/tiptap-editor/update-text-color'
import { UpdateTextFormating } from '@/core/components/tiptap-editor/update-text-formating'
import { UpdateTextHighlight } from '@/core/components/tiptap-editor/update-text-highlight'
import { UpdateTextListings } from '@/core/components/tiptap-editor/update-text-listings'
import { UpdateTextStyle } from '@/core/components/tiptap-editor/update-text-style'
import { Separator } from '@/core/components/ui/separator'

export const EditorToolbar = ({ editor }: { editor: Editor }) => (
	<div className="flex w-full shrink-0 items-center gap-px space-x-1 overflow-x-auto rounded-xl border border-input p-1 dark:bg-background">
		<UpdateTextStyle editor={editor} activeLevels={[1, 2, 3]} />

		<Separator orientation="vertical" className="h-7" />

		<UpdateTextFormating editor={editor} />

		<Separator orientation="vertical" className="h-7" />

		<UpdateTextColor editor={editor} />
		<UpdateTextHighlight editor={editor} />
		<ClearColorHighlight editor={editor} />

		<Separator orientation="vertical" className="h-7" />

		<UpdateTextListings editor={editor} />
	</div>
)
