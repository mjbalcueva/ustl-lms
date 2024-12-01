import * as React from 'react'
import { type Editor } from '@tiptap/react'
import { type VariantProps } from 'class-variance-authority'

import { EditorToolbarSection } from '@/core/components/tiptap-editor/editor-toolbar-section'
import { type toggleVariants } from '@/core/components/ui/toggle'
import { BulletList, ChevronDown, OrderedList } from '@/core/lib/icons'
import { type FormatAction } from '@/core/types/tiptap'

type ListItemAction = 'orderedList' | 'bulletList'

type ListItem = FormatAction & {
	value: ListItemAction
}

const formatActions: ListItem[] = [
	{
		value: 'orderedList',
		label: 'Numbered list',
		icon: <OrderedList className="size-5" />,
		isActive: (editor) => editor.isActive('orderedList'),
		action: (editor) => editor.chain().focus().toggleOrderedList().run(),
		canExecute: (editor) =>
			editor.can().chain().focus().toggleOrderedList().run(),
		shortcuts: ['mod', 'shift', '7']
	},
	{
		value: 'bulletList',
		label: 'Bullet list',
		icon: <BulletList className="size-5" />,
		isActive: (editor) => editor.isActive('bulletList'),
		action: (editor) => editor.chain().focus().toggleBulletList().run(),
		canExecute: (editor) =>
			editor.can().chain().focus().toggleBulletList().run(),
		shortcuts: ['mod', 'shift', '8']
	}
]

type UpdateTextListingsProps = VariantProps<typeof toggleVariants> & {
	editor: Editor
	activeActions?: ListItemAction[]
	mainActionCount?: number
}

export const UpdateTextListings: React.FC<UpdateTextListingsProps> = ({
	editor,
	activeActions = formatActions.map((action) => action.value),
	mainActionCount = 2,
	size,
	variant
}) => {
	return (
		<EditorToolbarSection
			editor={editor}
			actions={formatActions}
			activeActions={activeActions}
			mainActionCount={mainActionCount}
			dropdownIcon={
				<>
					<BulletList className="size-5" />
					<ChevronDown className="size-3" />
				</>
			}
			dropdownTooltip="Lists"
			size={size}
			variant={variant}
		/>
	)
}
UpdateTextListings.displayName = 'UpdateTextListings'
