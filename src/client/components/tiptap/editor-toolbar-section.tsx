import * as React from 'react'
import type { Editor } from '@tiptap/react'
import type { VariantProps } from 'class-variance-authority'
import { TbCaretDown } from 'react-icons/tb'

import { type FormatAction } from '@/shared/types/tiptap'

import { EditorToolbarButton } from '@/client/components/tiptap/editor-toolbar-button'
import { ShortcutKey } from '@/client/components/tiptap/shortcut-key'
import type { toggleVariants } from '@/client/components/ui'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

type EditorToolbarSectionProps = VariantProps<typeof toggleVariants> & {
	editor: Editor
	actions: FormatAction[]
	activeActions?: string[]
	mainActionCount?: number
	dropdownIcon?: React.ReactNode
	dropdownTooltip?: string
	dropdownClassName?: string
}

export const EditorToolbarSection: React.FC<EditorToolbarSectionProps> = ({
	editor,
	actions,
	activeActions = actions.map((action) => action.value),
	mainActionCount = 0,
	dropdownIcon,
	dropdownTooltip = 'More options',
	dropdownClassName = 'w-12',
	size,
	variant
}) => {
	const { mainActions, dropdownActions } = React.useMemo(() => {
		const sortedActions = actions
			.filter((action) => activeActions.includes(action.value))
			.sort((a, b) => activeActions.indexOf(a.value) - activeActions.indexOf(b.value))

		return {
			mainActions: sortedActions.slice(0, mainActionCount),
			dropdownActions: sortedActions.slice(mainActionCount)
		}
	}, [actions, activeActions, mainActionCount])

	const renderToolbarButton = React.useCallback(
		(action: FormatAction) => (
			<EditorToolbarButton
				key={action.label}
				onClick={() => action.action(editor)}
				disabled={!action.canExecute(editor)}
				isActive={action.isActive(editor)}
				tooltip={action.label}
				aria-label={action.label}
				size={size}
				variant={variant}
			>
				{action.icon}
			</EditorToolbarButton>
		),
		[editor, size, variant]
	)

	const renderDropdownMenuItem = React.useCallback(
		(action: FormatAction) => (
			<DropdownMenuItem
				key={action.label}
				onClick={() => action.action(editor)}
				disabled={!action.canExecute(editor)}
				className={cn('flex flex-row items-center justify-between gap-4', {
					'bg-accent': action.isActive(editor)
				})}
				aria-label={action.label}
			>
				<div className="flex items-center gap-2">
					{action.icon}
					<span>{action.label}</span>
				</div>
				<ShortcutKey keys={action.shortcuts} />
			</DropdownMenuItem>
		),
		[editor]
	)

	const isDropdownActive = React.useMemo(
		() => dropdownActions.some((action) => action.isActive(editor)),
		[dropdownActions, editor]
	)

	return (
		<>
			{mainActions.map(renderToolbarButton)}
			{dropdownActions.length > 0 && (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<EditorToolbarButton
							isActive={isDropdownActive}
							tooltip={dropdownTooltip}
							aria-label={dropdownTooltip}
							className={cn(dropdownClassName)}
							size={size}
							variant={variant}
						>
							{dropdownIcon ?? <TbCaretDown className="size-4" />}
						</EditorToolbarButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-full">
						{dropdownActions.map(renderDropdownMenuItem)}
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</>
	)
}
