'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

import { api, RouterOutputs } from '@/services/trpc/react'

import { Button } from '@/core/components/ui/button'
import { Attachment as AttachmentIcon, Delete, Loader2 } from '@/core/lib/icons'

export const AttachmentList = ({
	items
}: {
	items: RouterOutputs['instructor']['course']['findOneCourse']['course']['attachments']
}) => {
	const router = useRouter()

	const [deletingId, setDeletingId] = React.useState<string | null>(null)

	const { mutate } =
		api.instructor.courseAttachments.deleteCourseAttachment.useMutation({
			onSuccess: async (data) => {
				setDeletingId(null)
				router.refresh()
				toast.success(data.message)
			},
			onError: (error) => toast.error(error.message)
		})

	return (
		<ol className="space-y-2">
			{items.map((item) => (
				<li
					key={item.attachmentId}
					className="flex items-center rounded-xl border border-border py-1.5 pl-2.5"
				>
					<AttachmentIcon className="mr-2 size-4 flex-shrink-0 text-muted-foreground" />
					{item.name}
					{deletingId === item.attachmentId && (
						<div className="ml-auto mr-2.5 h-7 rounded-md p-2">
							<Loader2 className="size-4 animate-spin" />
						</div>
					)}
					{deletingId !== item.attachmentId && (
						<Button
							variant="ghost"
							size="xs"
							className="ml-auto mr-2.5 rounded-md p-2"
							onClick={() => {
								setDeletingId(item.attachmentId)
								mutate({ attachmentId: item.attachmentId })
							}}
						>
							<Delete className="size-4" />
						</Button>
					)}
				</li>
			))}
		</ol>
	)
}
