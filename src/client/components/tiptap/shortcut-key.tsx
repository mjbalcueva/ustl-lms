'use client'

import * as React from 'react'

import { getShortcutKeys } from '@/client/lib/shortcuts'
import { cn } from '@/client/lib/utils'

export type ShortcutKeyProps = React.HTMLAttributes<HTMLSpanElement> & {
	keys: string[]
}

export const ShortcutKey = React.forwardRef<HTMLSpanElement, ShortcutKeyProps>(({ className, keys, ...props }, ref) => {
	const modifiedKeys = React.useMemo(() => getShortcutKeys(keys), [keys])
	const ariaLabel = modifiedKeys.map((shortcut) => shortcut.readable).join(' + ')

	return (
		<span aria-label={ariaLabel} className={cn('inline-flex items-center gap-0.5', className)} {...props} ref={ref}>
			{modifiedKeys.map((shortcut) => (
				<kbd
					key={shortcut.symbol}
					className={cn(
						'inline-block min-w-2.5 text-center align-baseline font-sans text-xs font-medium capitalize text-muted-foreground',
						className
					)}
				>
					{shortcut.symbol}
				</kbd>
			))}
		</span>
	)
})

ShortcutKey.displayName = 'ShortcutKey'
