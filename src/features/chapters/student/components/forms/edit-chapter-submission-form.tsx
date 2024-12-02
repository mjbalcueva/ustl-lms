'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api, type RouterOutputs } from '@/services/trpc/react'

import { CardContent, CardFooter } from '@/core/components/compound-card'
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

import {
	editAssignmentSubmissionSchema,
	type EditAssignmentSubmissionSchema
} from '@/features/chapters/shared/validations/chapter-assignment-submission-schema'
import { Editor } from '@/features/chapters/student/components/editor/editor'

export const EditChapterSubmissionForm = ({
	chapterId,
	submission,
	isEditing,
	toggleEdit
}: {
	chapterId: RouterOutputs['student']['chapter']['findOneChapter']['chapter']['chapterId']
	submission: RouterOutputs['student']['chapter']['findOneChapter']['chapter']['submission']
	isEditing: boolean
	toggleEdit: () => void
}) => {
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

	if (!isEditing) {
		return (
			<CardContent isEmpty={!submission?.content}>
				{submission?.content ? (
					<>
						<Separator className="mb-4" />
						<ContentViewer value={submission?.content} />
					</>
				) : (
					'No content submitted yet.'
				)}
			</CardContent>
		)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit((values) => mutate(values))}>
				<CardContent className="space-y-6">
					{!isEditing && !submission?.content && 'No content submitted yet.'}
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

					<FormField
						control={form.control}
						name="attachments"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Attachments</FormLabel>
								<FormControl>
									<div className="space-y-4">
										{isEditing && (
											<UploadButton
												endpoint="attachmentUpload"
												onChange={handleFileUpload}
											/>
										)}
										<div className="mt-2">
											{(!field.value || field.value.length === 0) &&
												'No attachments uploaded yet.'}
											<ul className="list-inside list-disc">
												{field.value?.map((file, index) => (
													<li
														key={index}
														className="text-sm text-muted-foreground"
													>
														{file.name}
													</li>
												))}
											</ul>
										</div>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</CardContent>

				<CardFooter>
					<Button type="submit" disabled={isPending}>
						Save
					</Button>
				</CardFooter>
			</form>
		</Form>
	)
}
