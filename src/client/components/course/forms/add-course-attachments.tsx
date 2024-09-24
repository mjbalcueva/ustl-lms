'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { type Attachment } from '@prisma/client'
import { TbCirclePlus } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'

import { AttachmentList } from '@/client/components/course/attachment-list'
import { FileUpload } from '@/client/components/file-upload'
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/client/components/ui'

type AddCourseAttachmentProps = {
	courseId: string
	attachments: Attachment[]
}

export const AddCourseAttachmentsForm = ({ courseId, attachments }: AddCourseAttachmentProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => setIsEditing((current) => !current)

	const { mutate } = api.attachment.addAttachment.useMutation({
		onSuccess: async (data) => {
			toggleEdit()
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	const hasAttachments = attachments?.length > 0

	return (
		<Card>
			<CardHeader>
				<CardTitle>Course Attachment</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && <TbCirclePlus className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : 'Add'}
				</Button>
			</CardHeader>

			<CardContent isEmpty={!hasAttachments}>
				{!isEditing && !hasAttachments && 'No attachment added'}
				{!isEditing && hasAttachments && <AttachmentList items={attachments} />}
				{isEditing && (
					<FileUpload
						endpoint="attachmentUpload"
						onChange={(url, name) =>
							mutate({
								courseId,
								url: url ?? '',
								name: name ?? ''
							})
						}
					/>
				)}
			</CardContent>

			{isEditing && (
				<CardFooter className="text-sm text-muted-foreground">
					Add anything your students might need to complete the course
				</CardFooter>
			)}
		</Card>
	)
}
