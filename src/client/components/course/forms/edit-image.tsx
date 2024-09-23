'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { TbCirclePlus, TbEdit, TbLibraryPhoto } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'

import { FileUpload } from '@/client/components/file-upload'
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/client/components/ui'

type EditImageProps = {
	courseId: string
	initialData: {
		image: string
	}
}

export const EditImageForm = ({ courseId, initialData }: EditImageProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => setIsEditing((current) => !current)

	const { mutate } = api.course.updateImage.useMutation({
		onSuccess: async (data) => {
			router.refresh()
			toggleEdit()
			toast.success(data.message)
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle>Course Image</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && initialData.image && <TbEdit className="mr-2 size-4" />}
					{!isEditing && !initialData.image && <TbCirclePlus className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : initialData.image ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			<CardContent className="pb-5">
				{!isEditing && initialData.image && (
					<div className="relative aspect-video">
						<Image
							src={initialData.image}
							alt="Course Image"
							fill
							className="rounded-xl border border-input"
							priority
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
					</div>
				)}

				{!isEditing && !initialData.image && (
					<div className="flex aspect-video items-center justify-center rounded-xl border border-input bg-card dark:bg-background">
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
