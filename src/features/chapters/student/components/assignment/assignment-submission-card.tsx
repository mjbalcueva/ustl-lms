'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api, type RouterOutputs } from '@/services/trpc/react'

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/core/components/compound-card'
import { ContentViewer } from '@/core/components/tiptap-editor/content-viewer'
import { Button } from '@/core/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/core/components/ui/form'
import { Separator } from '@/core/components/ui/separator'
import { UploadButton } from '@/core/components/ui/upload-button'
import { Add } from '@/core/lib/icons'

import {
	editAssignmentSubmissionSchema,
	type EditAssignmentSubmissionSchema
} from '@/features/chapters/shared/validations/chapter-assignment-submission-schema'
import { AttachmentList } from '@/features/chapters/student/components/assignment/chapter-attachment-list'
import { Editor } from '@/features/chapters/student/components/editor/editor'

export const AssignmentSubmissionCard = ({
	chapterId,
	submission
}: {
	chapterId: RouterOutputs['student']['chapter']['findOneChapter']['chapter']['chapterId']
	submission: RouterOutputs['student']['chapter']['findOneChapter']['chapter']['submission']
}) => {
	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => setIsEditing((current) => !current)

	const router = useRouter()

	const form = useForm<EditAssignmentSubmissionSchema>({
		resolver: zodResolver(editAssignmentSubmissionSchema),
		defaultValues: {
			chapterId,
			content: submission?.content ?? '',
			attachments: submission?.attachments ?? []
		}
	})

	const { mutate, isPending } =
		api.student.chapterSubmission.editAssignmentSubmission.useMutation({
			onSuccess: (data) => {
				toggleEdit()
				router.refresh()
				form.reset({
					chapterId,
					content: data.submission?.content ?? '',
					attachments: data.submission?.attachments ?? []
				})
				toast.success(data.message)
			},
			onError: (error) => toast.error(error.message)
		})

	const handleFileUpload = (url?: string, name?: string) => {
		if (url && name) {
			const currentAttachments = form.getValues('attachments') ?? []
			form.setValue('attachments', [...currentAttachments, { url, name }])
		}
	}

	return (
		<Card showBorderTrail={isEditing}>
			<CardHeader className="py-3">
				<CardTitle className="text-lg">Your Submission</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="sm">
					{!isEditing && <Add />}
					{isEditing ? 'Cancel' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && (
				<CardContent isEmpty={!submission?.content}>
					{submission?.content ? (
						<>
							<Separator className="mb-4" />
							<ContentViewer value={submission?.content} />
						</>
					) : (
						'No content submitted yet.'
					)}

					{submission?.attachments ? (
						<AttachmentList attachments={submission.attachments} />
					) : (
						'No attachments uploaded yet.'
					)}
				</CardContent>
			)}

			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit((values) => mutate(values))}>
						<CardContent className="space-y-6">
							{!isEditing &&
								!submission?.content &&
								'No content submitted yet.'}
							{!isEditing && submission?.content && (
								<ContentViewer value={submission?.content} />
							)}
							<FormField
								control={form.control}
								name="content"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Assignment Content</FormLabel>
										<FormControl>
											<Editor
												placeholder="Enter your assignment content here..."
												throttleDelay={2000}
												output="html"
												autofocus={true}
												immediatelyRender={false}
												editable={true}
												injectCSS={true}
												onUpdate={field.onChange}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<UploadButton
								variant="outline"
								endpoint="attachmentUpload"
								onChange={handleFileUpload}
								className="!text-card-foreground"
							/>
						</CardContent>

						<CardFooter>
							<Button type="submit" disabled={isPending}>
								Save
							</Button>
						</CardFooter>
					</form>
				</Form>
			)}
		</Card>
	)
}
