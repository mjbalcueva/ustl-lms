import * as React from 'react'
import { type Editor } from '@tiptap/react'
import { type VariantProps } from 'class-variance-authority'
import { TbChevronDown, TbList, TbListNumbers } from 'react-icons/tb'

import { type FormatAction } from '@/shared/types/tiptap'

import { EditorToolbarSection } from '@/client/components/tiptap/editor-toolbar-section'
import { type toggleVariants } from '@/client/components/ui/toggle'

type ListItemAction = 'orderedList' | 'bulletList'

type ListItem = FormatAction & {
	value: ListItemAction
}

const formatActions: ListItem[] = [
	{
		value: 'orderedList',
		label: 'Numbered list',
		icon: <TbListNumbers className="size-5" />,
		isActive: (editor) => editor.isActive('orderedList'),
		action: (editor) => editor.chain().focus().toggleOrderedList().run(),
		canExecute: (editor) => editor.can().chain().focus().toggleOrderedList().run(),
		shortcuts: ['mod', 'shift', '7']
	},
	{
		value: 'bulletList',
		label: 'Bullet list',
		icon: <TbList className="size-5" />,
		isActive: (editor) => editor.isActive('bulletList'),
		action: (editor) => editor.chain().focus().toggleBulletList().run(),
		canExecute: (editor) => editor.can().chain().focus().toggleBulletList().run(),
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
					<TbList className="size-5" />
					<TbChevronDown className="size-3" />
				</>
			}
			dropdownTooltip="Lists"
			size={size}
			variant={variant}
		/>
	)
}
UpdateTextListings.displayName = 'UpdateTextListings'
