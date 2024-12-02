'use client'

import * as React from 'react'
import { toast } from 'sonner'

import { api, type RouterOutputs } from '@/services/trpc/react'

import { Button } from '@/core/components/ui/button'
import { Attachment as AttachmentIcon, Delete, Loader2 } from '@/core/lib/icons'

type SubmissionAttachment = NonNullable<
	RouterOutputs['student']['submission']['findOneSubmission']['submission']
>['attachments'][number]

export const AttachmentList = ({
	attachments
}: {
	attachments: SubmissionAttachment[]
}) => {
	const utils = api.useUtils()
	const [deletingId, setDeletingId] = React.useState<string | null>(null)

	const { mutate } =
		api.student.submissionAttachment.deleteSubmissionAttachment.useMutation({
			onSuccess: () => {
				setDeletingId(null)
				void utils.student.submission.findOneSubmission.invalidate()
				toast.success('Attachment deleted')
			},
			onError: (error) => toast.error(error.message)
		})

	return (
		<ol className="space-y-2">
			{attachments.map((attachment) => (
				<li
					key={attachment.attachmentId}
					className="flex items-center gap-2 rounded-xl border border-border pr-2 hover:bg-muted/50"
				>
					<a
						href={attachment.url}
						target="_blank"
						rel="noopener noreferrer"
						className="flex h-full flex-1 items-center gap-1 rounded-lg py-1.5 pl-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						<span className="flex-shrink-0 p-2">
							<AttachmentIcon className="size-4" />
						</span>
						<span>{attachment.name}</span>
					</a>

					<Button
						variant="ghost"
						size="xs"
						className="h-8 rounded-md p-2"
						onClick={() => {
							setDeletingId(attachment.attachmentId)
							mutate({ attachmentId: attachment.attachmentId })
						}}
						disabled={deletingId === attachment.attachmentId}
					>
						{deletingId === attachment.attachmentId ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							<Delete className="size-4" />
						)}
					</Button>
				</li>
			))}
		</ol>
	)
}
