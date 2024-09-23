'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { TbEdit } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { editChapterTitleSchema, type EditChapterTitleSchema } from '@/shared/validations/chapter'

import {
	Button,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	Input
} from '@/client/components/ui'

type EditChapterTitleProps = {
	chapterId: string
	title: string
}

export const EditChapterTitleForm = ({ chapterId, title }: EditChapterTitleProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const form = useForm<EditChapterTitleSchema>({
		resolver: zodResolver(editChapterTitleSchema),
		defaultValues: {
			chapterId,
			title
		}
	})

	const { mutate, isPending } = api.chapter.editTitle.useMutation({
		onSuccess: async (data) => {
			router.refresh()
			form.reset({
				chapterId,
				title: data.newTitle
			})
			toggleEdit()
			toast.success(data.message)
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	const onSubmit: SubmitHandler<EditChapterTitleSchema> = (data) => mutate(data)

	const chapterTitle = form.getValues('title')

	return (
		<Card>
			<CardHeader>
				<CardTitle>Chapter Title</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && chapterTitle && <TbEdit className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : chapterTitle ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && <CardContent>{chapterTitle}</CardContent>}

			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent>
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="e.g. 'Advanced web development'" disabled={isPending} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter>
							<Button
								type="submit"
								size="card"
								disabled={!form.formState.isDirty || isPending}
								variant={isPending ? 'shine' : 'default'}
							>
								{isPending ? 'Saving...' : 'Save'}
							</Button>
						</CardFooter>
					</form>
				</Form>
			)}
		</Card>
	)
}
