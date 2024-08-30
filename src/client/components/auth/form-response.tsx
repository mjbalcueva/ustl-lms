import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { Icons } from '@/client/components/icons'
import { cn } from '@/client/lib/utils'

const formResponseVariants = cva('flex items-center rounded-xl border p-3', {
	variants: {
		type: {
			success: 'border-emerald-500/15 bg-emerald-500/15 text-emerald-500',
			error: 'border-destructive/15 bg-destructive/15 text-destructive'
		}
	},
	defaultVariants: {
		type: 'success'
	}
})

type FormResponseProps = React.HTMLAttributes<HTMLDivElement> &
	VariantProps<typeof formResponseVariants> & {
		message?: string | null
	}

export function FormResponse({ type, message, className, ...props }: FormResponseProps) {
	if (!message) return null

	const formResponseIcon: Record<string, React.ReactNode> = {
		success: <Icons.circleCheckFilled className="size-4 min-h-4 min-w-4" />,
		error: <Icons.triangleAlertFilled className="size-4 min-h-4 min-w-4" />
	}

	return (
		<div className={cn(formResponseVariants({ type, className }))} {...props}>
			<span className="flex items-end gap-2 text-sm leading-none">
				{formResponseIcon[type ?? 'success']}
				{message}
			</span>
		</div>
	)
}
