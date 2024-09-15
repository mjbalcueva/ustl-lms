'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { LuPencil } from 'react-icons/lu'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { updateCodeSchema, type UpdateCodeSchema } from '@/shared/validations/course'

import {
	CardContent,
	CardContentContainer,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	CardWrapper
} from '@/client/components/instructor/course/card-wrapper'
import { Button, Form, FormControl, FormField, FormItem, FormMessage, Input } from '@/client/components/ui'

type UpdateCodeProps = {
	courseId: string
	initialData: {
		code: string
	}
}

export const UpdateCode = ({ courseId, initialData }: UpdateCodeProps) => {
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
			form.reset()
			toast.success(data.message)
			toggleEdit()
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	const onSubmit: SubmitHandler<UpdateCodeSchema> = (data) => mutate(data)

	return (
		<CardWrapper>
			<CardHeader>
				<div className="flex flex-col space-y-1.5">
					<CardTitle>Course Code</CardTitle>
					<CardDescription>Course catalog identifier</CardDescription>
				</div>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{isEditing ? (
						'Cancel'
					) : (
						<>
							<LuPencil className="mr-2 size-4" /> Edit Code
						</>
					)}
				</Button>
			</CardHeader>

			{!isEditing && (
				<CardContent>
					<CardContentContainer>{initialData?.code}</CardContentContainer>
				</CardContent>
			)}

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
