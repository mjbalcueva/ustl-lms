'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { type Attachment } from '@prisma/client'
import { LuFile, LuLoader, LuPlusCircle, LuX } from 'react-icons/lu'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'

import { FileUpload } from '@/client/components/file-upload'
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/client/components/ui'

type AddAttachmentsProps = {
	courseId: string
	initialData: { attachment?: Attachment[] }
}

export const AddAttachmentsForm = ({ courseId, initialData }: AddAttachmentsProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const [deletingId, setDeletingId] = React.useState<string | null>(null)
	const toggleEdit = () => setIsEditing((current) => !current)

	const { mutate: createAttachment } = api.attachment.createAttachment.useMutation({
		onSuccess: async (data) => {
			router.refresh()
			toggleEdit()
			toast.success(data.message)
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	const { mutate: deleteAttachment } = api.attachment.deleteAttachment.useMutation({
		onSuccess: async (data) => {
			router.refresh()
			setDeletingId(null)
			toast.success(data.message)
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle>Course Attachment</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && <LuPlusCircle className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : 'Add'}
				</Button>
			</CardHeader>

			<CardContent isEmpty={initialData.attachment?.length === 0}>
				{!isEditing && initialData.attachment?.length === 0 && 'No attachment added'}

				{!isEditing && !!initialData.attachment && (
					<ol className="space-y-2">
						{initialData.attachment.map((attachment) => (
							<li key={attachment.id} className="flex items-center rounded-xl border border-border px-5 py-3">
								<LuFile className="mr-2 size-4 flex-shrink-0" />
								<p className="line-clamp-1 text-xs">{attachment.name}</p>

								{deletingId === attachment.id && <LuLoader className="ml-auto size-4 animate-spin" />}

								{deletingId !== attachment.id && (
									<button
										className="ml-auto rounded-full hover:opacity-75"
										onClick={() => {
											setDeletingId(attachment.id)
											deleteAttachment({ attachmentId: attachment.id })
										}}
									>
										<LuX className="size-4" />
									</button>
								)}
							</li>
						))}
					</ol>
				)}

				{isEditing && (
					<FileUpload
						endpoint="attachmentUpload"
						onChange={(url, name) =>
							createAttachment({
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
