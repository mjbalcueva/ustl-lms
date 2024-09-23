'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { TbEdit } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { updateCodeSchema, type UpdateCodeSchema } from '@/shared/validations/course'

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

type EditCodeProps = {
	courseId: string
	initialData: {
		code: string
	}
}
export const EditCodeForm = ({ courseId, initialData }: EditCodeProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const form = useForm<UpdateCodeSchema>({
		resolver: zodResolver(updateCodeSchema),
		defaultValues: {
			courseId,
			code: initialData.code
		}
	})

	const { mutate, isPending } = api.course.updateCode.useMutation({
		onSuccess: async (data) => {
			router.refresh()
			form.reset({
				courseId,
				code: data.course.code
			})
			toggleEdit()
			toast.success(data.message)
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	const onSubmit: SubmitHandler<UpdateCodeSchema> = (data) => mutate(data)

	const code = form.getValues('code')

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
					<form onSubmit={form.handleSubmit(onSubmit)}>
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
