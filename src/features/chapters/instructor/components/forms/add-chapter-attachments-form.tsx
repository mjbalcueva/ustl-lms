'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

import { api, type RouterOutputs } from '@/services/trpc/react'

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/core/components/compound-card'
import { Button } from '@/core/components/ui/button'
import { FileUpload } from '@/core/components/ui/file-upload'
import { Add } from '@/core/lib/icons'

import { AttachmentList } from '@/features/chapters/instructor/components/chapter-attachment-list'

export const AddChapterAttachmentsForm = ({
	chapterId,
	attachments
}: {
	chapterId: RouterOutputs['instructor']['chapter']['findOneChapter']['chapter']['chapterId']
	attachments: RouterOutputs['instructor']['chapter']['findOneChapter']['chapter']['attachments']
}) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => setIsEditing((current) => !current)

	const { mutate } =
		api.instructor.chapterAttachments.addChapterAttachment.useMutation({
			onSuccess: async (data) => {
				toggleEdit()
				router.refresh()
				toast.success(data.message)
			},
			onError: (error) => toast.error(error.message)
		})

	const hasAttachments = attachments?.length > 0

	return (
		<Card showBorderTrail={isEditing}>
			<CardHeader>
				<CardTitle>Attachments</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="sm">
					{!isEditing && <Add />}
					{isEditing ? 'Cancel' : 'Add'}
				</Button>
			</CardHeader>

			<CardContent isEmpty={!hasAttachments}>
				{!isEditing && !hasAttachments && 'No resource added'}
				{!isEditing && hasAttachments && (
					<AttachmentList attachments={attachments} />
				)}
				{isEditing && (
					<FileUpload
						endpoint="attachmentUpload"
						onChange={(url, name) =>
							mutate({
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
