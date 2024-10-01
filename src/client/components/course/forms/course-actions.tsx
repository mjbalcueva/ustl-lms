'use client'

import { useRouter } from 'next/navigation'
import { TbTrash } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { type CourseActionsSchema } from '@/shared/validations/course'

import { Button } from '@/client/components/ui'

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

			<Button
				size="icon"
				disabled={isDeleting}
				variant={'destructive'}
				onClick={() => {
					deleteCourse({ id, isPublished })
				}}
				className="size-9 rounded-md"
			>
				<TbTrash className="size-5" />
			</Button>
		</div>
	)
}
