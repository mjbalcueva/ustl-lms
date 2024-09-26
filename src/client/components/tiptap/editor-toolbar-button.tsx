import * as React from 'react'
import type { TooltipContentProps } from '@radix-ui/react-tooltip'

import { Toggle, Tooltip, TooltipContent, TooltipTrigger } from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

type EditorToolbarButtonProps = React.ComponentPropsWithoutRef<typeof Toggle> & {
	isActive?: boolean
	tooltip?: string
	tooltipOptions?: TooltipContentProps
}

export const EditorToolbarButton = React.forwardRef<HTMLButtonElement, EditorToolbarButtonProps>(
	({ isActive, children, tooltip, className, tooltipOptions, ...props }, ref) => {
		const toggleButton = (
			<Toggle size="sm" ref={ref} className={cn('rounded-lg border', { 'bg-accent': isActive }, className)} {...props}>
				{children}
			</Toggle>
		)

		if (!tooltip) return toggleButton

		return (
			<Tooltip>
				<TooltipTrigger asChild>{toggleButton}</TooltipTrigger>
				<TooltipContent {...tooltipOptions}>
					<div className="flex flex-col items-center text-center">{tooltip}</div>
				</TooltipContent>
			</Tooltip>
		)
	}
)

EditorToolbarButton.displayName = 'EditorToolbarButton'
