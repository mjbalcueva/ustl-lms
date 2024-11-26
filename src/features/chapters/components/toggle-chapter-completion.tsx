'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { api } from '@/services/trpc/react'

import { Button } from '@/core/components/ui/button'
import { Loader } from '@/core/components/ui/loader'
import { Check, CheckCircle } from '@/core/lib/icons'

type ToggleChapterCompletionProps = {
	chapterId: string
	isCompleted?: boolean
}

export const ToggleChapterCompletion = ({
	chapterId,
	isCompleted: initialIsCompleted = false
}: ToggleChapterCompletionProps) => {
	const router = useRouter()
	const [isLocalCompleted, setIsLocalCompleted] = useState(initialIsCompleted)

	const { mutate, isPending } = api.chapter.toggleChapterCompletion.useMutation({
		onMutate: () => {
			setIsLocalCompleted((prev) => !prev)
		},
		onError: () => {
			setIsLocalCompleted((prev) => !prev)
			toast.error('Something went wrong')
			router.refresh()
		},
		onSuccess: (data) => {
			toast.success(data.message)
			router.refresh()
		}
	})

	return (
		<Button onClick={() => mutate({ chapterId })} disabled={isPending}>
			{isPending ? (
				<>
					<Loader size="small" className="mr-2" /> Loading...
				</>
			) : isLocalCompleted ? (
				<>
					<CheckCircle className="!size-5" /> Completed
				</>
			) : (
				<>
					<Check className="!size-5" /> Mark as Done
				</>
			)}
		</Button>
	)
}
