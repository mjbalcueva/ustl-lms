import { type Editor } from '@tiptap/react'

import { ClearColorHighlight } from '@/client/components/tiptap//clear-color-highlight'
import { UpdateTextHighlight } from '@/client/components/tiptap//update-text-highlight'
import { UpdateTextColor } from '@/client/components/tiptap/update-text-color'
import { UpdateTextFormating } from '@/client/components/tiptap/update-text-formating'
import { UpdateTextStyle } from '@/client/components/tiptap/update-text-style'
import { Separator } from '@/client/components/ui'

import { UpdateTextListings } from './update-text-listings'

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
