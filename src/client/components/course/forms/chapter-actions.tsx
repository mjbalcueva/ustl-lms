'use client'

import { useRouter } from 'next/navigation'
import { TbTrash } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { type ChapterActionsSchema } from '@/shared/validations/chapter'

import { Button } from '@/client/components/ui'

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

			<Button
				size="icon"
				disabled={isDeleting}
				variant={'destructive'}
				onClick={() => {
					deleteChapter({ id, courseId, isPublished })
				}}
				className="size-9 rounded-md"
			>
				<TbTrash className="size-5" />
			</Button>
		</div>
	)
}
