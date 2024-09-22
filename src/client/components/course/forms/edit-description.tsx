'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { LuPencil, LuPlusCircle } from 'react-icons/lu'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { updateDescriptionSchema, type UpdateDescriptionSchema } from '@/shared/validations/course'

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
	Textarea
} from '@/client/components/ui'

type EditDescriptionProps = {
	courseId: string
	initialData: {
		description: string
	}
}

export const EditDescriptionForm = ({ courseId, initialData }: EditDescriptionProps) => {
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
		<Card>
			<CardHeader>
				<CardTitle>Course Description</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && initialData.description && <LuPencil className="mr-2 size-4" />}
					{!isEditing && !initialData.description && <LuPlusCircle className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : initialData.description ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && (
				<CardContent isEmpty={!initialData.description}>
					{initialData.description ? initialData.description : 'No description added'}
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
		</Card>
	)
}
