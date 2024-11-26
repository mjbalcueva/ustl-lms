'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

import { api, RouterOutputs } from '@/services/trpc/react'

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

import { AttachmentList } from '@/features/courses/instructor/components/course-attachment-list'

export const AddCourseAttachmentsForm = ({
	courseId,
	attachments
}: {
	courseId: RouterOutputs['instructor']['course']['findOneCourse']['course']['courseId']
	attachments: RouterOutputs['instructor']['course']['findOneCourse']['course']['attachments']
}) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => setIsEditing((current) => !current)

	const { mutate } =
		api.instructor.courseAttachments.addCourseAttachment.useMutation({
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
				<CardTitle>Course Reference Material</CardTitle>
				<Button variant="ghost" size="sm" onClick={toggleEdit}>
					{!isEditing && <Add />}
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
