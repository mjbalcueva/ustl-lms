'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { api, type RouterOutputs } from '@/services/trpc/react'

import { Button } from '@/core/components/ui/button'
import { Loader } from '@/core/components/ui/loader'
import { Check, CheckCircle } from '@/core/lib/icons'

export const EditChapterCompletion = ({
	chapter
}: {
	chapter: RouterOutputs['student']['chapter']['findOneChapter']['chapter']
}) => {
	const router = useRouter()
	const [isLocalCompleted, setIsLocalCompleted] = useState(
		chapter?.chapterProgress[0]?.isCompleted ?? false
	)

	const { mutate, isPending } =
		api.student.chapter.editChapterCompletion.useMutation({
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
		<Button
			onClick={() => mutate({ chapterId: chapter?.chapterId ?? '' })}
			disabled={isPending}
		>
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
