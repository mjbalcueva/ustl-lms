import * as React from 'react'
import { type Editor } from '@tiptap/react'
import { type VariantProps } from 'class-variance-authority'

import { EditorToolbarSection } from '@/core/components/tiptap-editor/editor-toolbar-section'
import { type toggleVariants } from '@/core/components/ui/toggle'
import {
	Bold,
	ClearFormatting,
	Code,
	DotsHorizontal,
	Italic,
	Strikethrough,
	Underline
} from '@/core/lib/icons'
import { type FormatAction } from '@/core/types/tiptap'

type TextStyleAction =
	| 'bold'
	| 'italic'
	| 'strikethrough'
	| 'code'
	| 'clearFormatting'
	| 'underline'

type TextStyle = FormatAction & {
	value: TextStyleAction
}

const formatActions: TextStyle[] = [
	{
		value: 'bold',
		label: 'Bold',
		icon: <Bold className="size-5" />,
		action: (editor) => editor.chain().focus().toggleBold().run(),
		isActive: (editor) => editor.isActive('bold'),
		canExecute: (editor) =>
			editor.can().chain().focus().toggleBold().run() &&
			!editor.isActive('codeBlock'),
		shortcuts: ['mod', 'B']
	},
	{
		value: 'italic',
		label: 'Italic',
		icon: <Italic className="size-5" />,
		action: (editor) => editor.chain().focus().toggleItalic().run(),
		isActive: (editor) => editor.isActive('italic'),
		canExecute: (editor) =>
			editor.can().chain().focus().toggleItalic().run() &&
			!editor.isActive('codeBlock'),
		shortcuts: ['mod', 'I']
	},
	{
		value: 'underline',
		label: 'Underline',
		icon: <Underline className="size-5" />,
		action: (editor) => editor.chain().focus().toggleUnderline().run(),
		isActive: (editor) => editor.isActive('underline'),
		canExecute: (editor) =>
			editor.can().chain().focus().toggleUnderline().run() &&
			!editor.isActive('codeBlock'),
		shortcuts: ['mod', 'U']
	},
	{
		value: 'strikethrough',
		label: 'Strikethrough',
		icon: <Strikethrough className="size-5" />,
		action: (editor) => editor.chain().focus().toggleStrike().run(),
		isActive: (editor) => editor.isActive('strike'),
		canExecute: (editor) =>
			editor.can().chain().focus().toggleStrike().run() &&
			!editor.isActive('codeBlock'),
		shortcuts: ['mod', 'shift', 'S']
	},
	{
		value: 'code',
		label: 'Code',
		icon: <Code className="size-5" />,
		action: (editor) => editor.chain().focus().toggleCode().run(),
		isActive: (editor) => editor.isActive('code'),
		canExecute: (editor) =>
			editor.can().chain().focus().toggleCode().run() &&
			!editor.isActive('codeBlock'),
		shortcuts: ['mod', 'E']
	},
	{
		value: 'clearFormatting',
		label: 'Clear formatting',
		icon: <ClearFormatting className="size-5" />,
		action: (editor) => editor.chain().focus().unsetAllMarks().run(),
		isActive: () => false,
		canExecute: (editor) =>
			editor.can().chain().focus().unsetAllMarks().run() &&
			!editor.isActive('codeBlock'),
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
	mainActionCount = 6,
	size,
	variant
}) => {
	return (
		<EditorToolbarSection
			editor={editor}
			actions={formatActions}
			activeActions={activeActions}
			mainActionCount={mainActionCount}
			dropdownIcon={<DotsHorizontal className="size-5" />}
			dropdownTooltip="More formatting"
			dropdownClassName="w-fit"
			size={size}
			variant={variant}
		/>
	)
}

UpdateTextFormating.displayName = 'SectionTwo'
