'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { LuPencil } from 'react-icons/lu'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { updateTitleSchema, type UpdateTitleSchema } from '@/shared/validations/course'

import {
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	CardWrapper
} from '@/client/components/instructor/course/card-wrapper'
import { Button, Form, FormControl, FormField, FormItem, FormMessage, Input } from '@/client/components/ui'

type UpdateTitleProps = {
	courseId: string
	initialData: {
		title: string
	}
}

export const UpdateTitle = ({ courseId, initialData }: UpdateTitleProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => setIsEditing((current) => !current)

	const form = useForm<UpdateTitleSchema>({
		resolver: zodResolver(updateTitleSchema),
		defaultValues: {
			courseId,
			title: initialData.title
		}
	})

	const { mutate, isPending } = api.course.updateTitle.useMutation({
		onSuccess: async (data) => {
			router.refresh()
			form.reset({
				courseId,
				title: data.course.title
			})
			toggleEdit()
			toast.success(data.message)
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	const onSubmit: SubmitHandler<UpdateTitleSchema> = (data) => mutate(data)

	return (
		<CardWrapper>
			<CardHeader>
				<CardTitle>Course Title</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && initialData.title && <LuPencil className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : initialData.title ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && <CardContent>{initialData?.title}</CardContent>}

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
							<Button type="submit" size="card" disabled={!form.formState.isDirty || isPending}>
								Save
							</Button>
						</CardFooter>
					</form>
				</Form>
			)}
		</CardWrapper>
	)
}
