'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '@/services/trpc/react'

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/core/components/compound-card'
import { Button } from '@/core/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/core/components/ui/form'
import { Input } from '@/core/components/ui/input'
import { Edit } from '@/core/lib/icons'

import {
	editCourseTitleSchema,
	type EditCourseTitleSchema
} from '@/features/courses/validations/course-title-schema'

export const EditCourseTitleForm = ({ id, title }: EditCourseTitleSchema) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const form = useForm<EditCourseTitleSchema>({
		resolver: zodResolver(editCourseTitleSchema),
		defaultValues: { id, title }
	})
	const formTitle = form.getValues('title')

	const { mutate, isPending } = api.course.editTitle.useMutation({
		onSuccess: async (data) => {
			toggleEdit()
			form.reset({ id, title: data.newTitle })
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card showBorderTrail={isEditing}>
			<CardHeader>
				<CardTitle>Course Title</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="sm">
					{!isEditing && <Edit />}
					{isEditing ? 'Cancel' : 'Edit'}
				</Button>
			</CardHeader>

			{!isEditing && <CardContent>{formTitle}</CardContent>}

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
											<Input
												placeholder="e.g. 'Advanced web development'"
												disabled={isPending}
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
			)}
		</Card>
	)
}
