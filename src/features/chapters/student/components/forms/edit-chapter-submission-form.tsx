'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
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
import { Textarea } from '@/core/components/ui/textarea'

import {
	editAssignmentSubmissionSchema,
	type EditAssignmentSubmissionSchema
} from '@/features/chapters/shared/validations/chapter-assignment-submission-schema'

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
						<div className="whitespace-pre-wrap">{submission?.content}</div>
					)}
					{isEditing && (
						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Content</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Enter your assignment content here..."
											className="min-h-[200px] resize-none"
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
