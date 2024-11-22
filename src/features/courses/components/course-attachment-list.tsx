'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { type Attachment } from '@prisma/client'
import { toast } from 'sonner'

import { api } from '@/services/trpc/react'

import { Button } from '@/core/components/ui/button'
import { Attachment as AttachmentIcon, Delete, Loader2 } from '@/core/lib/icons'

type AttachmentListProps = {
	items: Attachment[]
}

export const AttachmentList = ({ items }: AttachmentListProps) => {
	const router = useRouter()

	const [deletingId, setDeletingId] = React.useState<string | null>(null)

	const { mutate } = api.course.deleteAttachment.useMutation({
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
					key={item.id}
					className="flex items-center rounded-xl border border-border py-1.5 pl-2.5"
				>
					<AttachmentIcon className="mr-2 size-4 flex-shrink-0 text-muted-foreground" />
					{item.name}
					{deletingId === item.id && <Loader2 className="ml-auto size-4 animate-spin" />}
					{deletingId !== item.id && (
						<Button
							variant="ghost"
							size="xs"
							className="ml-auto mr-2.5 rounded-md p-2"
							onClick={() => {
								setDeletingId(item.id)
								mutate({ attachmentId: item.id })
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
