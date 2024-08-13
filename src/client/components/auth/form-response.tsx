import { Icons } from '@/client/components/icons'
import { cn } from '@/client/lib/utils'

type FormResponseType = 'success' | 'error'

type FormResponseProps = {
	type: FormResponseType
	message?: string | null
}

const formResponseIcon: Record<FormResponseType, React.ReactNode> = {
	success: <Icons.circleCheckFilled className="size-4" />,
	error: <Icons.triangleAlertFilled className="size-4" />
}

export function FormResponse({ type, message }: FormResponseProps) {
	if (!message) return null

	return (
		<div
			className={cn(
				'flex h-10 items-center gap-2 rounded-xl border p-3 text-sm',
				type === 'success'
					? 'border-emerald-500/15 bg-emerald-500/15 text-emerald-500'
					: 'border-destructive/15 bg-destructive/15 text-destructive'
			)}
		>
			{formResponseIcon[type]}
			{message}
		</div>
	)
}
