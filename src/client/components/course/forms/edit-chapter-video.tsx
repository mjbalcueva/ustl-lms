'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { type Chapter, type MuxData } from '@prisma/client'
import { TbCirclePlus, TbEdit, TbVideoPlus } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'

import { FileUpload } from '@/client/components/file-upload'
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/client/components/ui'

type EditChapterVideoProps = {
	id: string
	courseId: string
	initialData: Chapter & { muxData: MuxData | null }
}

export const EditChapterVideoForm = ({ id, courseId, initialData }: EditChapterVideoProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => setIsEditing((current) => !current)

	const { mutate } = api.chapter.editVideo.useMutation({
		onSuccess: async (data) => {
			toggleEdit()
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	const videoUrl = initialData.videoUrl

	return (
		<Card>
			<CardHeader>
				<CardTitle>Chapter Video</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && videoUrl && <TbEdit className="mr-2 size-4" />}
					{!isEditing && !videoUrl && <TbCirclePlus className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : videoUrl ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			<CardContent className="pb-5" isEmpty={!videoUrl}>
				{isEditing && (
					<FileUpload endpoint="videoUpload" onChange={(url) => mutate({ id, courseId, videoUrl: url ?? '' })} />
				)}

				{!isEditing &&
					(videoUrl ? (
						'Video Uploaded'
					) : (
						<div className="flex h-[11.5rem] items-center justify-center rounded-xl border border-input bg-card dark:bg-background">
							<TbVideoPlus className="size-10 text-card-foreground dark:text-muted-foreground" />
						</div>
					))}
			</CardContent>

			<CardFooter className="text-sm text-muted-foreground">
				{isEditing && 'Upload a pre-recorded video or relevant content to enhance your course.'}
				{!isEditing &&
					(videoUrl
						? 'Videos may take a few minutes to process. Refresh the page if the video does not appear.'
						: 'Upload a video to enhance your course.')}
			</CardFooter>
		</Card>
	)
}
