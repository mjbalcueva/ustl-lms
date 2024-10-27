'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import MuxPlayer from '@mux/mux-player-react'
import { type Chapter, type MuxData } from '@prisma/client'
import { toast } from 'sonner'

import { api } from '@/services/trpc/react'

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/core/components/compound-card'
import { Button } from '@/core/components/ui/button'
import { FileUpload } from '@/core/components/ui/file-upload'
import { Add, Edit, Video } from '@/core/lib/icons'

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
		<Card showBorderTrail={isEditing}>
			<CardHeader>
				<CardTitle>Add a video</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="sm">
					{!isEditing && (videoUrl ? <Edit /> : <Add />)}
					{isEditing ? 'Cancel' : videoUrl ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			<CardContent className="pb-5" isEmpty={!videoUrl}>
				{isEditing && (
					<FileUpload
						endpoint="videoUpload"
						onChange={(url) => mutate({ id, courseId, videoUrl: url ?? '' })}
					/>
				)}

				{!isEditing &&
					(videoUrl ? (
						<MuxPlayer
							playbackId={initialData.muxData?.playbackId}
							title={initialData.title}
							accentColor="#737373"
							primaryColor="#fafafa"
							className="aspect-video overflow-hidden rounded-xl border border-input"
							disableTracking
						/>
					) : (
						<div className="flex h-[11.5rem] items-center justify-center rounded-xl border border-input bg-card dark:bg-background">
							<Video className="size-10 text-card-foreground dark:text-muted-foreground" />
						</div>
					))}
			</CardContent>

			<CardFooter className="text-sm text-muted-foreground">
				{isEditing && 'Upload a pre-recorded video or relevant content to enhance your chapter.'}
				{!isEditing &&
					(videoUrl
						? 'Videos may take a few minutes to process. Refresh the page if the video does not appear.'
						: 'Upload a video to enhance your chapter.')}
			</CardFooter>
		</Card>
	)
}
