'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { LuPencil } from 'react-icons/lu'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { updateDescriptionSchema, type UpdateDescriptionSchema } from '@/shared/validations/course'

import {
	CardContent,
	CardContentContainer,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	CardWrapper
} from '@/client/components/instructor/course/card-wrapper'
import { Button, Form, FormControl, FormField, FormItem, FormMessage, Textarea } from '@/client/components/ui'

type UpdateDescriptionProps = {
	courseId: string
	initialData: {
		description: string
	}
}

export const UpdateDescription = ({ courseId, initialData }: UpdateDescriptionProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => setIsEditing((current) => !current)

	const form = useForm<UpdateDescriptionSchema>({
		resolver: zodResolver(updateDescriptionSchema),
		defaultValues: {
			courseId,
			description: initialData.description
		}
	})

	const { mutate, isPending } = api.course.updateDescription.useMutation({
		onSuccess: async (data) => {
			router.refresh()
			form.reset({
				courseId,
				description: data.course.description ?? ''
			})
			toggleEdit()
			toast.success(data.message)
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	const onSubmit: SubmitHandler<UpdateDescriptionSchema> = (data) => mutate(data)

	return (
		<CardWrapper>
			<CardHeader>
				<div className="flex flex-col space-y-1.5">
					<CardTitle>Course Description</CardTitle>
					<CardDescription>Course catalog identifier</CardDescription>
				</div>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{isEditing ? (
						'Cancel'
					) : (
						<>
							<LuPencil className="mr-2 size-4" /> Edit Description
						</>
					)}
				</Button>
			</CardHeader>

			{!isEditing && (
				<CardContent>
					{initialData.description ? <CardContentContainer>{initialData.description}</CardContentContainer> : null}
				</CardContent>
			)}

			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Textarea placeholder="e.g. 'CS101'" disabled={isPending} {...field} />
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
