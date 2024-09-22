'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { LuPencil } from 'react-icons/lu'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { updateCodeSchema, type UpdateCodeSchema } from '@/shared/validations/course'

import { CardContent, CardFooter, CardHeader, CardTitle, CardWrapper } from '@/client/components/card'
import { Button, Form, FormControl, FormField, FormItem, FormMessage, Input } from '@/client/components/ui'

type CodeEditProps = {
	courseId: string
	initialData: {
		code: string
	}
}
export const CodeEdit = ({ courseId, initialData }: CodeEditProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => setIsEditing((current) => !current)

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

	return (
		<CardWrapper>
			<CardHeader>
				<CardTitle>Course Code</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && initialData.code && <LuPencil className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : initialData.code ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && <CardContent>{initialData?.code}</CardContent>}

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
