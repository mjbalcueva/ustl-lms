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
import { Input } from '@/core/components/ui/input'
import { Edit } from '@/core/lib/icons'

import {
	editCourseCodeSchema,
	type EditCourseCodeSchema
} from '@/features/courses/shared/validations/course-schema'

export const EditCourseCodeForm = ({
	courseId,
	code
}: {
	courseId: RouterOutputs['instructor']['course']['findOneCourse']['course']['courseId']
	code: RouterOutputs['instructor']['course']['findOneCourse']['course']['code']
}) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const form = useForm<EditCourseCodeSchema>({
		resolver: zodResolver(editCourseCodeSchema),
		defaultValues: { courseId, code }
	})
	const formCode = form.getValues('code')

	const { mutate, isPending } = api.instructor.course.editCode.useMutation({
		onSuccess: async (data) => {
			toggleEdit()
			form.reset({ courseId, code: data.updatedCourse.code })
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card showBorderTrail={isEditing}>
			<CardHeader>
				<CardTitle>Course Code</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="sm">
					{!isEditing && formCode && <Edit />}
					{isEditing ? 'Cancel' : formCode ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && <CardContent>{formCode}</CardContent>}

			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit((data) => mutate(data))}>
						<CardContent>
							<FormField
								control={form.control}
								name="code"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												placeholder="e.g. 'CS101'"
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
