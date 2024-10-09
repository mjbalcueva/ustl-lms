'use client'

import { useRouter } from 'next/navigation'
import { TbLoader2, TbTrash } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { type DeleteChapterSchema, type EditStatusSchema } from '@/shared/validations/chapter'

import { ConfirmModal } from '@/client/components/confirm-modal'
import { Button } from '@/client/components/ui'

type ChapterActionsProps = DeleteChapterSchema & EditStatusSchema

export const ChapterActions = ({ id, courseId, status }: ChapterActionsProps) => {
	const router = useRouter()

	const { mutate: editStatus, isPending: isEditingStatus } = api.chapter.editStatus.useMutation({
		onSuccess: (data) => {
			toast.success(data.message)
			router.refresh()
		}
	})

	const { mutate: deleteChapter, isPending: isDeleting } = api.chapter.deleteChapter.useMutation({
		onSuccess: (data) => {
			toast.success(data.message)
			router.push(`/courses/${courseId}/edit`)
			router.refresh()
		}
	})

	return (
		<div className="flex items-center gap-2">
			<Button
				size="sm"
				disabled={isEditingStatus}
				variant={isEditingStatus ? 'shine' : 'default'}
				onClick={() => editStatus({ id, courseId, status: status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' })}
			>
				{status === 'PUBLISHED'
					? isEditingStatus
						? 'Unpublishing...'
						: 'Unpublish Topic'
					: isEditingStatus
						? 'Publishing...'
						: 'Publish Topic'}
			</Button>

			<ConfirmModal
				title="Are you sure you want to delete this chapter?"
				description="This action cannot be undone. This will permanently delete your chapter and remove your data from our servers."
				onConfirm={() => deleteChapter({ id })}
			>
				<Button size="icon" disabled={isDeleting} variant={'destructive'} className="size-9 rounded-md">
					{isDeleting ? <TbLoader2 className="size-5 animate-spin" /> : <TbTrash className="size-5" />}
				</Button>
			</ConfirmModal>
		</div>
	)
}
