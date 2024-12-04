'use client'

import { Attachment as AttachmentIcon } from '@/core/lib/icons'

interface PendingFilesListProps {
	files: File[]
}

export const PendingFilesList = ({ files }: PendingFilesListProps) => {
	if (files.length === 0) return null

	return (
		<ol className="space-y-2">
			{files.map((file, i) => (
				<li
					key={`${file.name}-${i}`}
					className="flex items-center gap-2 rounded-xl border border-yellow-500/80 bg-yellow-500/5 px-2 py-1.5 dark:border-yellow-500/40 dark:bg-yellow-400/10"
				>
					<span className="flex-shrink-0 p-2">
						<AttachmentIcon className="size-4" />
					</span>
					<div className="flex items-center gap-2">
						<span className="text-sm">{file.name}</span>
						<span className="text-xs text-yellow-700 dark:text-yellow-500">
							(Pending)
						</span>
					</div>
				</li>
			))}
		</ol>
	)
}
