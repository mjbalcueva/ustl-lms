'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { type Attachment } from '@prisma/client'
import { TbCirclePlus } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'

import { AttachmentList } from '@/client/components/course/attachment-list'
import { FileUpload } from '@/client/components/file-upload'
import { Button } from '@/client/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/client/components/ui/card'

type AddChapterAttachmentProps = {
	courseId: string
	chapterId: string
	attachments: Attachment[]
}

export const AddChapterAttachmentsForm = ({ courseId, chapterId, attachments }: AddChapterAttachmentProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => setIsEditing((current) => !current)

	const { mutate } = api.attachment.addChapterAttachment.useMutation({
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
				<CardTitle>Attachments</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && <TbCirclePlus className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : 'Add'}
				</Button>
			</CardHeader>

			<CardContent isEmpty={!hasAttachments}>
				{!isEditing && !hasAttachments && 'No resource added'}
				{!isEditing && hasAttachments && <AttachmentList items={attachments} />}
				{isEditing && (
					<FileUpload
						endpoint="attachmentUpload"
						onChange={(url, name) =>
							mutate({
								courseId,
								chapterId,
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
