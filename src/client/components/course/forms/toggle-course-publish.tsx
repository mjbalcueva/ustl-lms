'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { TbCircleCheck, TbHelpCircle } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { type ToggleCoursePublishSchema } from '@/shared/validations/course'

import { Button } from '@/client/components/ui'

export const ToggleCoursePublish = ({ id, isPublished }: ToggleCoursePublishSchema) => {
	const router = useRouter()

	const { mutate, isPending } = api.course.togglePublish.useMutation({
		onSuccess: (data) => {
			toast.success(data.message)
			router.refresh()
		}
	})

	return (
		<Button
			size="card"
			disabled={isPending}
			variant={isPending ? 'shine' : 'default'}
			onClick={() => {
				mutate({ id, isPublished: !isPublished })
			}}
		>
			{isPublished ? (
				isPending ? (
					'Unpublishing...'
				) : (
					<>
						<TbCircleCheck className="mr-1.5 size-5" />
						Course Published
					</>
				)
			) : isPending ? (
				'Publishing...'
			) : (
				<>
					<TbHelpCircle className="mr-1.5 size-5" />
					Publish Course
				</>
			)}
		</Button>
	)
}
