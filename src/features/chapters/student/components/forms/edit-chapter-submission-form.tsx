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
			content: submission?.content ?? ''
		}
	})

	const { mutate, isPending } =
		api.student.chapterSubmission.editAssignmentSubmission.useMutation({
			onSuccess: (data) => {
				toggleEdit()
				router.refresh()
				toast.success(data.message)
			},
			onError: (error) => toast.error(error.message)
		})

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit((values) => mutate(values))}>
				<CardContent>
					{!isEditing && !submission?.content && 'No content submitted yet.'}
					{!isEditing && submission?.content && (
						<ContentViewer value={submission?.content} />
					)}
					{isEditing && (
						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Content</FormLabel>
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
					)}
				</CardContent>

				{isEditing && (
					<CardFooter>
						<Button type="submit" disabled={isPending}>
							Save
						</Button>
					</CardFooter>
				)}
			</form>
		</Form>
	)
}
