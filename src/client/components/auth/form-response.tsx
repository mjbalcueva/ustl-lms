import { Icons } from '@/client/components/icons'
import { cn } from '@/client/lib/utils'

type FormResponseType = 'success' | 'error'

type FormResponseProps = React.HTMLAttributes<HTMLDivElement> & {
	type: FormResponseType
	message?: string | null
}

const formResponseIcon: Record<FormResponseType, React.ReactNode> = {
	success: <Icons.circleCheckFilled className="size-4 min-h-4 min-w-4" />,
	error: <Icons.triangleAlertFilled className="size-4 min-h-4 min-w-4" />
}

export function FormResponse({ type, message, className, ...props }: FormResponseProps) {
	if (!message) return null

	return (
		<div
			className={cn(
				'flex items-center rounded-xl border p-3',
				type === 'success'
					? 'border-emerald-500/15 bg-emerald-500/15 text-emerald-500'
					: 'border-destructive/15 bg-destructive/15 text-destructive',
				className
			)}
			{...props}
		>
			<div className="flex items-end gap-2 text-sm leading-none">
				{formResponseIcon[type]}
				{message}
			</div>
		</div>
	)
}
