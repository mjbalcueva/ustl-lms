import React, { useCallback, useMemo } from 'react'
import { type Level } from '@tiptap/extension-heading'
import { type Editor } from '@tiptap/react'
import { type VariantProps } from 'class-variance-authority'
import { type IconType } from 'react-icons'

import { EditorToolbarButton } from '@/core/components/tiptap-editor/editor-toolbar-button'
import { ShortcutKey } from '@/core/components/tiptap-editor/shortcut-key'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/core/components/ui/dropdown-menu'
import { type toggleVariants } from '@/core/components/ui/toggle'
import { ChevronDown, Heading1, Heading2, Heading3, Paragraph } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'
import { type FormatAction } from '@/core/types/tiptap'

type TextStyle = Omit<FormatAction, 'value' | 'icon' | 'action' | 'isActive' | 'canExecute'> & {
	element: keyof JSX.IntrinsicElements
	level?: Level
	className?: string
	icon: IconType
}

const formatActions: TextStyle[] = [
	{
		label: 'Heading 1',
		element: 'h1',
		level: 1,
		shortcuts: ['mod', 'alt', '1'],
		icon: Heading1
	},
	{
		label: 'Heading 2',
		element: 'h2',
		level: 2,
		shortcuts: ['mod', 'alt', '2'],
		icon: Heading2
	},
	{
		label: 'Heading 3',
		element: 'h3',
		level: 3,
		shortcuts: ['mod', 'alt', '3'],
		icon: Heading3
	},
	{
		label: 'Paragraph',
		element: 'p',
		shortcuts: ['mod', 'alt', '0'],
		icon: Paragraph
	}
]

type UpdateTextStyleProps = VariantProps<typeof toggleVariants> & {
	editor: Editor
	activeLevels?: Level[]
}

export const UpdateTextStyle: React.FC<UpdateTextStyleProps> = React.memo(
	({ editor, activeLevels = [1, 2, 3, 4, 5, 6], size, variant }) => {
		const filteredActions = useMemo(
			() => formatActions.filter((action) => !action.level || activeLevels.includes(action.level)),
			[activeLevels]
		)

		const handleStyleChange = useCallback(
			(level?: Level) => {
				if (level) {
					editor.chain().focus().toggleHeading({ level }).run()
				} else {
					editor.chain().focus().setParagraph().run()
				}
			},
			[editor]
		)

		const renderMenuItem = useCallback(
			({ label, element: Element, level, className, shortcuts, icon: Icon }: TextStyle) => (
				<DropdownMenuItem
					key={label}
					onClick={() => handleStyleChange(level)}
					className={cn('flex flex-row items-center justify-between gap-4', {
						'bg-accent': level
							? editor.isActive('heading', { level })
							: editor.isActive('paragraph')
					})}
					aria-label={label}
				>
					<div className="flex items-center gap-2">
						<Icon className="size-4 shrink-0" />
						<Element className={className}>{label}</Element>
					</div>
					<ShortcutKey keys={shortcuts} />
				</DropdownMenuItem>
			),
			[editor, handleStyleChange]
		)

		const activeStyle = useMemo(() => {
			return (
				filteredActions.find((action) =>
					action.level
						? editor.isActive('heading', { level: action.level })
						: editor.isActive('paragraph')
				) ?? filteredActions[0]
			)
		}, [editor, filteredActions])

		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<EditorToolbarButton
						tooltip={activeStyle?.label}
						aria-label={activeStyle?.label}
						pressed={editor.isActive('heading') || editor.isActive('paragraph')}
						className="justify-between"
						disabled={editor.isActive('codeBlock')}
						size={size}
						variant={variant}
					>
						{activeStyle?.icon && <activeStyle.icon className="size-5 shrink-0" />}
						<ChevronDown className="size-3 shrink-0" />
					</EditorToolbarButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" className="w-full space-y-1">
					{filteredActions.map(renderMenuItem)}
				</DropdownMenuContent>
			</DropdownMenu>
		)
	}
)

UpdateTextStyle.displayName = 'UpdateTextStyle'
