'use client'

import { useEffect } from 'react'
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

import {
	editSubmissionContentSchema,
	type EditSubmissionContentSchema
} from '@/features/chapters/shared/validations/chapter-submission-schema'
import { Editor } from '@/features/chapters/student/components/editor/editor'

export const EditChapterSubmissionForm = ({
	submission,
	setResetForm,
	onSubmitSuccess
}: {
	submission: NonNullable<
		RouterOutputs['student']['submission']['findOneSubmission']
	>['submission']
	setResetForm: (fn: () => void) => void
	onSubmitSuccess: () => void
}) => {
	const utils = api.useUtils()

	const form = useForm<EditSubmissionContentSchema>({
		resolver: zodResolver(editSubmissionContentSchema),
		defaultValues: {
			submissionId: submission?.submissionId,
			content: submission?.content ?? ''
		}
	})

	useEffect(() => {
		setResetForm(form.reset)
	}, [form.reset, setResetForm])

	const { mutate, isPending } =
		api.student.submission.editSubmissionContent.useMutation({
			onSuccess: () => {
				form.reset()
				void utils.student.submission.findOneSubmission.invalidate()
				toast.success('Submission updated successfully')
				onSubmitSuccess()
			},
			onMutate: async (newData) => {
				await utils.student.submission.findOneSubmission.cancel()
				const prevData = utils.student.submission.findOneSubmission.getData()

				utils.student.submission.findOneSubmission.setData(
					{ chapterId: submission!.chapterId },
					(old) =>
						old
							? {
									...old,
									submission: {
										...old.submission!,
										content: newData.content
									}
								}
							: old
				)

				return { prevData }
			},
			onError: (_, __, context) => {
				if (context?.prevData) {
					utils.student.submission.findOneSubmission.setData(
						{ chapterId: submission!.chapterId },
						context.prevData
					)
				}
			}
		})

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit((data) => mutate(data))}>
				<CardContent>
					<Separator className="mb-4" />

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
				</CardContent>

				<CardFooter>
					<Button
						type="submit"
						size="sm"
						disabled={!form.formState.isDirty || isPending}
						variant={isPending ? 'shine' : 'default'}
					>
						{isPending ? 'Saving...' : 'Save'}
					</Button>
				</CardFooter>
			</form>
		</Form>
	)
}
