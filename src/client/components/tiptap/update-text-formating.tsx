import * as React from 'react'
import type { Editor } from '@tiptap/react'
import type { VariantProps } from 'class-variance-authority'
import { TbBold, TbClearFormatting, TbCode, TbDots, TbItalic, TbStrikethrough } from 'react-icons/tb'

import { type FormatAction } from '@/shared/types/tiptap'

import { EditorToolbarSection } from '@/client/components/tiptap/editor-toolbar-section'
import type { toggleVariants } from '@/client/components/ui'

type TextStyleAction = 'bold' | 'italic' | 'strikethrough' | 'code' | 'clearFormatting'

type TextStyle = FormatAction & {
	value: TextStyleAction
}

const formatActions: TextStyle[] = [
	{
		value: 'bold',
		label: 'Bold',
		icon: <TbBold className="size-5" />,
		action: (editor) => editor.chain().focus().toggleBold().run(),
		isActive: (editor) => editor.isActive('bold'),
		canExecute: (editor) => editor.can().chain().focus().toggleBold().run() && !editor.isActive('codeBlock'),
		shortcuts: ['mod', 'B']
	},
	{
		value: 'italic',
		label: 'Italic',
		icon: <TbItalic className="size-5" />,
		action: (editor) => editor.chain().focus().toggleItalic().run(),
		isActive: (editor) => editor.isActive('italic'),
		canExecute: (editor) => editor.can().chain().focus().toggleItalic().run() && !editor.isActive('codeBlock'),
		shortcuts: ['mod', 'I']
	},
	{
		value: 'strikethrough',
		label: 'Strikethrough',
		icon: <TbStrikethrough className="size-5" />,
		action: (editor) => editor.chain().focus().toggleStrike().run(),
		isActive: (editor) => editor.isActive('strike'),
		canExecute: (editor) => editor.can().chain().focus().toggleStrike().run() && !editor.isActive('codeBlock'),
		shortcuts: ['mod', 'shift', 'S']
	},
	{
		value: 'code',
		label: 'Code',
		icon: <TbCode className="size-5" />,
		action: (editor) => editor.chain().focus().toggleCode().run(),
		isActive: (editor) => editor.isActive('code'),
		canExecute: (editor) => editor.can().chain().focus().toggleCode().run() && !editor.isActive('codeBlock'),
		shortcuts: ['mod', 'E']
	},
	{
		value: 'clearFormatting',
		label: 'Clear formatting',
		icon: <TbClearFormatting className="size-5" />,
		action: (editor) => editor.chain().focus().unsetAllMarks().run(),
		isActive: () => false,
		canExecute: (editor) => editor.can().chain().focus().unsetAllMarks().run() && !editor.isActive('codeBlock'),
		shortcuts: ['mod', '\\']
	}
]

type UpdateTextFormatingProps = VariantProps<typeof toggleVariants> & {
	editor: Editor
	activeActions?: TextStyleAction[]
	mainActionCount?: number
}

export const UpdateTextFormating: React.FC<UpdateTextFormatingProps> = ({
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
			dropdownIcon={<TbDots className="size-5" />}
			dropdownTooltip="More formatting"
			dropdownClassName="w-fit"
			size={size}
			variant={variant}
		/>
	)
}

UpdateTextFormating.displayName = 'SectionTwo'
