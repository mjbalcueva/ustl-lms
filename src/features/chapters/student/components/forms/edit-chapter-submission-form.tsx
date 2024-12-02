'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api, type RouterOutputs } from '@/services/trpc/react'

import { CardContent, CardFooter } from '@/core/components/compound-card'
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

import {
	editSubmissionContentSchema,
	type EditSubmissionContentSchema
} from '@/features/chapters/shared/validations/chapter-submission-schema'
import { AttachmentList } from '@/features/chapters/student/components/assignment/chapter-attachment-list'
import { Editor } from '@/features/chapters/student/components/editor/editor'

type Attachment = { name: string; url: string }

export const EditChapterSubmissionForm = ({
	submission,
	setResetForm,
	onSubmitSuccess
}: {
	submission: NonNullable<
		RouterOutputs['student']['submission']['findOneSubmission']['submission']
	>
	setResetForm: (fn: () => void) => void
	onSubmitSuccess: () => void
}) => {
	const utils = api.useUtils()
	const [attachments, setAttachments] = useState<Attachment[]>(
		submission.attachments.map(({ name, url }) => ({ name, url }))
	)
	const [isAttachmentsChanged, setIsAttachmentsChanged] = useState(false)

	const form = useForm<EditSubmissionContentSchema>({
		resolver: zodResolver(editSubmissionContentSchema),
		defaultValues: {
			submissionId: submission.submissionId,
			content: submission.content ?? '',
			attachments: []
		}
	})

	useEffect(() => {
		setResetForm(() => {
			form.reset()
			setAttachments(
				submission.attachments.map(({ name, url }) => ({ name, url }))
			)
			setIsAttachmentsChanged(false)
		})
	}, [form, setResetForm, submission.attachments])

	const { mutate, isPending } =
		api.student.submission.editSubmissionContent.useMutation({
			onSuccess: async (data) => {
				form.reset()
				setAttachments(
					data.updatedContent.attachments.map(({ name, url }) => ({
						name,
						url
					}))
				)
				setIsAttachmentsChanged(false)
				await utils.student.submission.findOneSubmission.invalidate()
				await utils.student.submission.findOneSubmission.refetch()
				toast.success('Submission updated successfully')
				onSubmitSuccess()
			},
			onMutate: async (newData) => {
				await utils.student.submission.findOneSubmission.cancel()
				const prevData = utils.student.submission.findOneSubmission.getData()

				utils.student.submission.findOneSubmission.setData(
					{ chapterId: submission.chapterId },
					(old) =>
						old && {
							...old,
							submission: {
								...old.submission!,
								content: newData.content,
								attachments: (newData.attachments ?? []).map((a) => ({
									...a,
									attachmentId: 'temp-id',
									submissionId: submission.submissionId,
									createdAt: new Date(),
									updatedAt: new Date()
								}))
							}
						}
				)

				return { prevData }
			},
			onError: (_, __, context) => {
				if (context?.prevData) {
					utils.student.submission.findOneSubmission.setData(
						{ chapterId: submission.chapterId },
						context.prevData
					)
				}
			}
		})

	const handleSubmit = form.handleSubmit((data) => {
		mutate({
			...data,
			attachments
		})
	})

	const handleAttachmentChange = (url?: string, name?: string) => {
		if (url && name) {
			setAttachments((prev) => {
				const exists = prev.some((a) => a.url === url && a.name === name)
				if (exists) return prev
				return [...prev, { url, name }]
			})
			setIsAttachmentsChanged(true)
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit}>
				<CardContent>
					<Separator className="mb-4" />

					<div className="space-y-6">
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

						<FormItem>
							<FormLabel>Attachments</FormLabel>
							<FormControl>
								<div className="space-y-4">
									<UploadButton
										endpoint="attachmentUpload"
										onChange={handleAttachmentChange}
									/>
									{attachments.length > 0 && (
										<AttachmentList
											attachments={attachments.map((a, i) => ({
												attachmentId: `temp-${i}`,
												submissionId: submission.submissionId,
												...a,
												createdAt: new Date(),
												updatedAt: new Date()
											}))}
										/>
									)}
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					</div>
				</CardContent>

				<CardFooter>
					<Button
						type="submit"
						size="sm"
						disabled={
							(!form.formState.isDirty && !isAttachmentsChanged) || isPending
						}
						variant={isPending ? 'shine' : 'default'}
					>
						{isPending ? 'Saving...' : 'Save'}
					</Button>
				</CardFooter>
			</form>
		</Form>
	)
}
