'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { LuImage, LuPencil, LuPlusCircle } from 'react-icons/lu'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'

import { FileUpload } from '@/client/components/file-upload'
import {
	CardContent,
	CardContentContainer,
	CardHeader,
	CardTitle,
	CardWrapper
} from '@/client/components/instructor/course/card-wrapper'
import { Button } from '@/client/components/ui'

type UpdateImageProps = {
	courseId: string
	initialData: {
		image: string
	}
}

export const UpdateImage = ({ courseId, initialData }: UpdateImageProps) => {
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
		<CardWrapper>
			<CardHeader>
				<div className="flex flex-col space-y-1.5">
					<CardTitle>Course Image</CardTitle>
				</div>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && initialData.image && <LuPencil className="mr-2 size-4" />}
					{!isEditing && !initialData.image && <LuPlusCircle className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : initialData.image ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			<CardContent>
				{!isEditing && initialData.image && (
					<CardContentContainer>
						<Image
							src={initialData.image}
							alt="Course Image"
							width={1920}
							height={1080}
							className="rounded-xl border border-input"
							priority
						/>
					</CardContentContainer>
				)}

				{!isEditing && !initialData.image && (
					<div className="flex items-center justify-center rounded-xl border border-input bg-card py-6 dark:bg-background">
						<LuImage className="size-10 text-card-foreground dark:text-muted-foreground" />
					</div>
				)}

				{isEditing && <FileUpload endpoint="imageUpload" onChange={(url) => mutate({ courseId, image: url })} />}
			</CardContent>
		</CardWrapper>
	)
}