'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { LuPencil } from 'react-icons/lu'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { updateTitleSchema, type UpdateTitleSchema } from '@/shared/validations/course'

import {
	CardContent,
	CardContentContainer,
	CardDescription,
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
			form.reset()
			toast.success(data.message)
			toggleEdit()
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	const onSubmit: SubmitHandler<UpdateTitleSchema> = (data) => mutate(data)

	return (
		<CardWrapper>
			<CardHeader>
				<div className="flex flex-col space-y-1.5">
					<CardTitle>Course Title</CardTitle>
					<CardDescription>
						This is used to identify the course and will be displayed in the course listing.
					</CardDescription>
				</div>
				<Button onClick={toggleEdit} variant="ghost" size="sm" className="bg-card">
					{isEditing ? (
						'Cancel'
					) : (
						<>
							<LuPencil className="mr-2 size-4" /> Edit Title
						</>
					)}
				</Button>
			</CardHeader>

			{!isEditing && (
				<CardContent>
					<CardContentContainer>{initialData?.title}</CardContentContainer>
				</CardContent>
			)}

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
											<Input disabled={isPending} placeholder="e.g. 'Advanced web development'" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter>
							<Button disabled={!form.formState.isDirty || isPending} type="submit" size="sm">
								Save
							</Button>
						</CardFooter>
					</form>
				</Form>
			)}
		</CardWrapper>
	)
}
