'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { TbCirclePlus, TbEdit, TbLibraryPhoto } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'

import { FileUpload } from '@/client/components/file-upload'
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/client/components/ui'

type EditCourseImageProps = {
	courseId: string
	initialImage: string | null
}

export const EditCourseImageForm = ({ courseId, initialImage }: EditCourseImageProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => setIsEditing((current) => !current)

	const { mutate } = api.course.editImage.useMutation({
		onSuccess: async (data) => {
			toggleEdit()
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle>Course Image</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && initialImage && <TbEdit className="mr-2 size-4" />}
					{!isEditing && !initialImage && <TbCirclePlus className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : initialImage ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			<CardContent className="pb-5">
				{!isEditing && initialImage && (
					<div className="relative aspect-video">
						<Image
							src={initialImage}
							alt="Course Image"
							fill
							className="rounded-xl border border-input"
							priority
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
					</div>
				)}

				{!isEditing && !initialImage && (
					<div className="flex h-[11.5rem] items-center justify-center rounded-xl border border-input bg-card dark:bg-background">
						<TbLibraryPhoto className="size-10 text-card-foreground dark:text-muted-foreground" />
					</div>
				)}

				{isEditing && (
					<FileUpload endpoint="imageUpload" onChange={(url) => mutate({ courseId, imageUrl: url ?? '' })} />
				)}
			</CardContent>

			{isEditing && (
				<CardFooter className="text-sm text-muted-foreground">
					Upload a captivating course image that represents your content and engages your students.
				</CardFooter>
			)}
		</Card>
	)
}
