'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { TbEdit } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { editCodeSchema, type EditCodeSchema } from '@/shared/validations/course'

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

type EditCourseCodeProps = {
	courseId: string
	initialCode: string
}
export const EditCourseCodeForm = ({ courseId, initialCode }: EditCourseCodeProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const form = useForm<EditCodeSchema>({
		resolver: zodResolver(editCodeSchema),
		defaultValues: {
			courseId,
			code: initialCode
		}
	})
	const code = form.getValues('code')

	const { mutate, isPending } = api.course.editCode.useMutation({
		onSuccess: async (data) => {
			toggleEdit()
			form.reset({
				courseId,
				code: data.newCode
			})
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle>Course Code</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && code && <TbEdit className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : code ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && <CardContent>{code}</CardContent>}

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
											<Input placeholder="e.g. 'CS101'" disabled={isPending} {...field} />
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
