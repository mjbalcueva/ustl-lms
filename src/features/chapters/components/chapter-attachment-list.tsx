'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { type Attachment } from '@prisma/client'
import { toast } from 'sonner'

import { api } from '@/services/trpc/react'

import { Attachment as AttachmentIcon, Loader2, X } from '@/core/lib/icons'

type AttachmentListProps = {
	items: Attachment[]
}

export const AttachmentList = ({ items }: AttachmentListProps) => {
	const router = useRouter()

	const [deletingId, setDeletingId] = React.useState<string | null>(null)

	const { mutate } = api.chapter.deleteAttachment.useMutation({
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
				<li key={item.id} className="flex h-10 items-center rounded-xl border border-border pl-2.5">
					<AttachmentIcon className="mr-2 size-4 flex-shrink-0 text-muted-foreground" />
					{item.name}
					{deletingId === item.id && <Loader2 className="ml-auto size-4 animate-spin" />}
					{deletingId !== item.id && (
						<button
							className="ml-auto h-full rounded-r-xl pl-1 pr-2 outline-none hover:opacity-75 focus-visible:outline-ring"
							onClick={() => {
								setDeletingId(item.id)
								mutate({ attachmentId: item.id })
							}}
						>
							<X className="size-4" />
						</button>
					)}
				</li>
			))}
		</ol>
	)
}