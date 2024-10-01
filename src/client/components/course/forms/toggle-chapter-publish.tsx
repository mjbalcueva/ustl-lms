'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { TbCircleCheck, TbHelpCircle } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { type ToggleChapterPublishSchema } from '@/shared/validations/chapter'

import { Button } from '@/client/components/ui'

export const ToggleChapterPublish = ({ id, courseId, isPublished }: ToggleChapterPublishSchema) => {
	const router = useRouter()

	const { mutate, isPending } = api.chapter.toggleChapterPublish.useMutation({
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
				mutate({ id, courseId, isPublished: !isPublished })
			}}
		>
			{isPublished ? (
				isPending ? (
					'Unpublishing...'
				) : (
					<>
						<TbCircleCheck className="mr-1.5 size-5" />
						Topic Published
					</>
				)
			) : isPending ? (
				'Publishing...'
			) : (
				<>
					Publish Topic
					<TbHelpCircle className="ml-1.5 size-5" />
				</>
			)}
		</Button>
	)
}
