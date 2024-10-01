'use client'

import { useRouter } from 'next/navigation'
import { TbLoader2, TbTrash } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { type ChapterActionsSchema } from '@/shared/validations/chapter'

import { Button } from '@/client/components/ui'

import { ConfirmModal } from '../../confirm-modal'

export const ChapterActions = ({ id, courseId, isPublished }: ChapterActionsSchema) => {
	const router = useRouter()

	const { mutate: togglePublish, isPending: isPublishing } = api.chapter.toggleChapterPublish.useMutation({
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
				disabled={isPublishing}
				variant={isPublishing ? 'shine' : 'default'}
				onClick={() => {
					togglePublish({ id, courseId, isPublished: !isPublished })
				}}
			>
				{isPublished
					? isPublishing
						? 'Unpublishing...'
						: 'Unpublish Topic'
					: isPublishing
						? 'Publishing...'
						: 'Publish Topic'}
			</Button>

			<ConfirmModal
				title="Are you sure you want to delete this chapter?"
				description="This action cannot be undone. This will permanently delete your chapter and remove your data from our servers."
				onConfirm={() => {
					deleteChapter({ id, courseId, isPublished })
				}}
			>
				<Button size="icon" disabled={isDeleting} variant={'destructive'} className="size-9 rounded-md">
					{isDeleting ? <TbLoader2 className="size-5 animate-spin" /> : <TbTrash className="size-5" />}
				</Button>
			</ConfirmModal>
		</div>
	)
}
