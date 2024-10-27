import * as React from 'react'
import { type TooltipContentProps } from '@radix-ui/react-tooltip'

import { Toggle } from '@/core/components/ui/toggle'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/core/components/ui/tooltip'
import { cn } from '@/core/lib/utils/cn'

type EditorToolbarButtonProps = React.ComponentPropsWithoutRef<typeof Toggle> & {
	isActive?: boolean
	tooltip?: string
	tooltipOptions?: TooltipContentProps
}

export const EditorToolbarButton = React.forwardRef<HTMLButtonElement, EditorToolbarButtonProps>(
	({ isActive, children, tooltip, className, size = 'xs', tooltipOptions, ...props }, ref) => {
		const toggleButton = (
			<Toggle
				size={size}
				ref={ref}
				className={cn('rounded-lg', { 'bg-accent': isActive }, className)}
				{...props}
			>
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
