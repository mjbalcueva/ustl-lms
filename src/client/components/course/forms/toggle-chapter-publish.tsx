'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
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
			{isPublished
				? isPending
					? 'Unpublishing...'
					: 'Unpublish Topic'
				: isPending
					? 'Publishing...'
					: 'Publish Topic'}
		</Button>
	)
}
