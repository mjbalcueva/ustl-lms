'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { type Attachment, type Course } from '@prisma/client'
import { LuPencil, LuPlusCircle } from 'react-icons/lu'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'

import { FileUpload } from '@/client/components/file-upload'
import { CardContent, CardHeader, CardTitle, CardWrapper } from '@/client/components/instructor/course/card-wrapper'
import { Button, CardFooter } from '@/client/components/ui'

type UpdateAttachmentProps = {
	courseId: string
	initialData: Course & { attachment?: Attachment[] }
}

export const UpdateAttachment = ({ courseId, initialData }: UpdateAttachmentProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => setIsEditing((current) => !current)

	const { mutate } = api.course.createAttachment.useMutation({
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
					<CardTitle>Course Attachment</CardTitle>
				</div>

				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && initialData.attachment && <LuPencil className="mr-2 size-4" />}
					{!isEditing && !initialData.attachment && <LuPlusCircle className="mr-2 size-4" />}

					{isEditing ? 'Cancel' : initialData.attachment ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			<CardContent isEmpty={!!initialData.attachment}>
				{!isEditing && initialData.attachment?.length === 0 && 'No attachment added'}
				{isEditing && (
					<FileUpload endpoint="attachmentUpload" onChange={(url) => mutate({ courseId, attachmentUrl: url ?? '' })} />
				)}
			</CardContent>

			{isEditing && (
				<CardFooter>
					<span className="text-sm text-muted-foreground">
						Add anything your students might need to complete the course
					</span>
				</CardFooter>
			)}
		</CardWrapper>
	)
}
