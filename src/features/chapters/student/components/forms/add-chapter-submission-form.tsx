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
	addSubmissionContentSchema,
	type AddSubmissionContentSchema
} from '@/features/chapters/shared/validations/chapter-submission-schema'
import { Editor } from '@/features/chapters/student/components/editor/editor'

export const AddChapterSubmissionForm = ({
	chapterId,
	setResetForm,
	onSubmitSuccess
}: {
	chapterId: NonNullable<
		RouterOutputs['student']['chapter']['findOneChapter']['chapter']
	>['chapterId']
	setResetForm: (fn: () => void) => void
	onSubmitSuccess: () => void
}) => {
	const utils = api.useUtils()

	const form = useForm<AddSubmissionContentSchema>({
		resolver: zodResolver(addSubmissionContentSchema),
		defaultValues: {
			chapterId,
			content: ''
		}
	})

	useEffect(() => {
		setResetForm(() => form.reset)
	}, [form.reset, setResetForm])

	const { mutate, isPending } =
		api.student.submission.addSubmissionContent.useMutation({
			onSuccess: () => {
				form.reset()
				void utils.student.submission.findOneSubmission.invalidate()
				toast.success('Submission added successfully')
				onSubmitSuccess()
			},
			onMutate: async (newData) => {
				await utils.student.submission.findOneSubmission.cancel()
				const prevData = utils.student.submission.findOneSubmission.getData()

				utils.student.submission.findOneSubmission.setData(
					{ chapterId },
					(old) =>
						old ?? {
							submission: {
								submissionId: 'temp-id',
								chapterId,
								studentId: 'temp-id',
								content: newData.content,
								submittedAt: new Date(),
								updatedAt: new Date(),
								grade: null
							}
						}
				)

				return { prevData }
			},
			onError: (_, __, context) => {
				if (context?.prevData) {
					utils.student.submission.findOneSubmission.setData(
						{ chapterId },
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
