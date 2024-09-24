'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { TbCirclePlus, TbEdit } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { editDescriptionSchema, type EditDescriptionSchema } from '@/shared/validations/course'

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

type EditCourseDescriptionProps = {
	courseId: string
	initialDescription: string | null
}

export const EditCourseDescriptionForm = ({ courseId, initialDescription }: EditCourseDescriptionProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const form = useForm<EditDescriptionSchema>({
		resolver: zodResolver(editDescriptionSchema),
		defaultValues: {
			courseId,
			description: initialDescription ?? ''
		}
	})
	const description = form.getValues('description')

	const { mutate, isPending } = api.course.editDescription.useMutation({
		onSuccess: async (data) => {
			toggleEdit()
			form.reset({
				courseId,
				description: data.newDescription ?? ''
			})
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle>Course Description</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && description && <TbEdit className="mr-2 size-4" />}
					{!isEditing && !description && <TbCirclePlus className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : description ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && (
				<CardContent isEmpty={!description}>{description ? description : 'No description added'}</CardContent>
			)}

			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit((data) => mutate(data))}>
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
