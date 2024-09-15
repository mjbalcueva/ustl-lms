'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { LuPencil } from 'react-icons/lu'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { updateTitleSchema, type UpdateTitleSchema } from '@/shared/validations/course'

import { CardWrapper } from '@/client/components/instructor/course/card-wrapper'
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
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	const onSubmit: SubmitHandler<UpdateTitleSchema> = (data) => mutate(data)

	return (
		<CardWrapper>
			<div className="flex items-center justify-between font-medium">
				Course Title
				<Button onClick={toggleEdit} variant="ghost" size="sm" className="bg-card">
					{isEditing ? (
						'Cancel'
					) : (
						<>
							<LuPencil className="mr-2 size-4" /> Edit Title
						</>
					)}
				</Button>
			</div>

			{!isEditing && <p className="mt-2 text-sm dark:text-gray-300">{initialData?.title}</p>}

			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4 dark:text-gray-300">
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
						<div className="flex items-center gap-x-2">
							<Button disabled={!form.formState.isDirty || isPending} type="submit" size="sm">
								Save
							</Button>
						</div>
					</form>
				</Form>
			)}
		</CardWrapper>
	)
}
