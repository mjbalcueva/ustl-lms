import { Flag } from '@/core/lib/icons'

export const AssessmentTip = () => {
	return (
		<div className="flex items-center gap-2 rounded-xl border border-yellow-500/80 bg-yellow-500/5 px-5 py-3 dark:border-yellow-500/40 dark:bg-yellow-400/10">
			<span className="text-sm text-yellow-700 dark:text-yellow-500">Tip:</span>
			<div className="flex items-center gap-2 text-sm">
				Click the
				<Flag className="size-4" />
				icon to mark questions for review.
			</div>
		</div>
	)
}
