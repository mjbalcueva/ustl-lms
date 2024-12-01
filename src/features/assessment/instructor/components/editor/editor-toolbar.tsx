import { type Editor } from '@tiptap/react'

import { UpdateTextFormating } from '@/core/components/tiptap-editor/update-text-formating'
import { UpdateTextListings } from '@/core/components/tiptap-editor/update-text-listings'
import { Separator } from '@/core/components/ui/separator'
import { cn } from '@/core/lib/utils/cn'

export const EditorToolbar = ({
	editor,
	inputClassName
}: {
	editor: Editor
	inputClassName?: string
}) => (
	<div
		className={cn(
			'flex w-full shrink-0 items-center gap-px space-x-1 overflow-x-auto rounded-xl border border-input p-1 dark:bg-background',
			inputClassName
		)}
	>
		<UpdateTextFormating editor={editor} />

		<Separator orientation="vertical" className="h-7" />

		<UpdateTextListings editor={editor} />
	</div>
)
