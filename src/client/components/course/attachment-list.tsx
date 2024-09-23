'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { type Attachment } from '@prisma/client'
import { TbFile, TbLoader2, TbX } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'

type AttachmentListProps = {
	items: Attachment[]
}

export const AttachmentList = ({ items }: AttachmentListProps) => {
	const router = useRouter()

	const [deletingId, setDeletingId] = React.useState<string | null>(null)

	const { mutate } = api.attachment.deleteAttachment.useMutation({
		onSuccess: async (data) => {
			router.refresh()
			setDeletingId(null)
			toast.success(data.message)
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	return (
		<ol className="space-y-2">
			{items.map((item) => (
				<li key={item.id} className="flex items-center rounded-xl border border-border px-3 py-3">
					<TbFile className="mr-2 size-4 flex-shrink-0" />
					{item.name}
					{deletingId === item.id && <TbLoader2 className="ml-auto size-4 animate-spin" />}
					{deletingId !== item.id && (
						<button
							className="ml-auto rounded-full hover:opacity-75"
							onClick={() => {
								setDeletingId(item.id)
								mutate({ attachmentId: item.id })
							}}
						>
							<TbX className="size-4" />
						</button>
					)}
				</li>
			))}
		</ol>
	)
}
