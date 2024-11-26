'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api, type RouterOutputs } from '@/services/trpc/react'

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/core/components/compound-card'
import { Button } from '@/core/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from '@/core/components/ui/form'
import { Textarea } from '@/core/components/ui/textarea'
import { Add, Edit } from '@/core/lib/icons'

import {
	editCourseDescriptionSchema,
	type EditCourseDescriptionSchema
} from '@/features/courses/shared/validations/course-schema'

export const EditCourseDescriptionForm = ({
	courseId,
	description
}: {
	courseId: RouterOutputs['instructor']['course']['findOneCourse']['course']['courseId']
	description: RouterOutputs['instructor']['course']['findOneCourse']['course']['description']
}) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const form = useForm<EditCourseDescriptionSchema>({
		resolver: zodResolver(editCourseDescriptionSchema),
		defaultValues: { courseId, description }
	})
	const formDescription = form.getValues('description')

	const { mutate, isPending } =
		api.instructor.course.editDescription.useMutation({
			onSuccess: async (data) => {
				toggleEdit()
				form.reset({ courseId, description: data.course.description ?? '' })
				router.refresh()
				toast.success(data.message)
			},
			onError: (error) => toast.error(error.message)
		})

	return (
		<Card showBorderTrail={isEditing}>
			<CardHeader>
				<CardTitle>Course Description</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="sm">
					{!isEditing && (formDescription ? <Edit /> : <Add />)}
					{isEditing ? 'Cancel' : formDescription ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && (
				<CardContent isEmpty={!formDescription}>
					{formDescription ? formDescription : 'No description added'}
				</CardContent>
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
											<Textarea
												placeholder="e.g. 'CS101'"
												disabled={isPending}
												value={field.value ?? ''}
												onChange={field.onChange}
												onBlur={field.onBlur}
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
