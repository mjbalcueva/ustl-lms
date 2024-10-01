'use client'

import { useRouter } from 'next/navigation'
import { TbLoader2, TbTrash } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { type CourseActionsSchema } from '@/shared/validations/course'

import { Button } from '@/client/components/ui'

import { ConfirmModal } from '../../confirm-modal'

export const CourseActions = ({ id, isPublished }: CourseActionsSchema) => {
	const router = useRouter()

	const { mutate: togglePublish, isPending: isPublishing } = api.course.togglePublish.useMutation({
		onSuccess: (data) => {
			toast.success(data.message)
			router.refresh()
		}
	})

	const { mutate: deleteCourse, isPending: isDeleting } = api.course.deleteCourse.useMutation({
		onSuccess: (data) => {
			toast.success(data.message)
			router.push(`/courses/manage`)
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
					togglePublish({ id, isPublished: !isPublished })
				}}
			>
				{isPublished
					? isPublishing
						? 'Unpublishing...'
						: 'Unpublish Course'
					: isPublishing
						? 'Publishing...'
						: 'Publish Course'}
			</Button>

			<ConfirmModal
				title="Are you sure you want to delete this course?"
				description="This action cannot be undone. This will permanently delete your course and remove your data from our servers."
				onConfirm={() => {
					deleteCourse({ id, isPublished })
				}}
			>
				<Button size="icon" disabled={isDeleting} variant={'destructive'} className="size-9 rounded-md">
					{isDeleting ? <TbLoader2 className="size-5 animate-spin" /> : <TbTrash className="size-5" />}
				</Button>
			</ConfirmModal>
		</div>
	)
}
