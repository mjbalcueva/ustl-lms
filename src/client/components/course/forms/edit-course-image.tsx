'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { TbCirclePlus, TbEdit } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { type EditImageSchema } from '@/shared/validations/course'

import { Button } from '@/client/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/client/components/ui/card'
import { FileUpload } from '@/client/components/ui/file-upload'
import { Icons } from '@/client/components/ui/icons'

export const EditCourseImageForm = ({ id, imageUrl }: EditImageSchema) => {
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
					{!isEditing && imageUrl && <TbEdit className="mr-2 size-4" />}
					{!isEditing && !imageUrl && <TbCirclePlus className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : imageUrl ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			<CardContent className="pb-5">
				{isEditing && <FileUpload endpoint="imageUpload" onChange={(url) => mutate({ id: id, imageUrl: url ?? '' })} />}

				{!isEditing &&
					(imageUrl ? (
						<div className="relative aspect-video">
							<Image
								src={imageUrl}
								alt="Course Image"
								fill
								className="rounded-xl border border-input object-cover"
								priority
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							/>
						</div>
					) : (
						<div className="flex h-[11.5rem] items-center justify-center rounded-xl border border-input bg-card dark:bg-background">
							<Icons.image className="size-10 text-card-foreground dark:text-muted-foreground" />
						</div>
					))}
			</CardContent>

			<CardFooter className="text-sm text-muted-foreground">
				{isEditing && 'Upload a captivating course image that represents your content and engages your students.'}
				{!isEditing &&
					(imageUrl
						? 'Your course image is now visible. It helps attract students and represents your content.'
						: 'Upload an image to enhance your course.')}
			</CardFooter>
		</Card>
	)
}
