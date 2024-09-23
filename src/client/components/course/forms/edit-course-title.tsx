'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { TbEdit } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { editCourseTitleSchema, type EditCourseTitleSchema } from '@/shared/validations/course'

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

type EditCourseTitleProps = {
	courseId: string
	initialTitle: string
}

export const EditCourseTitleForm = ({ courseId, initialTitle }: EditCourseTitleProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const form = useForm<EditCourseTitleSchema>({
		resolver: zodResolver(editCourseTitleSchema),
		defaultValues: {
			courseId,
			title: initialTitle
		}
	})
	const title = form.getValues('title')

	const { mutate, isPending } = api.course.editTitle.useMutation({
		onSuccess: async (data) => {
			toggleEdit()
			form.reset({
				courseId,
				title: data.newTitle
			})
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle>Course Title</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && title && <TbEdit className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : title ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && <CardContent>{form.watch('title')}</CardContent>}

			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit((data) => mutate(data))}>
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
