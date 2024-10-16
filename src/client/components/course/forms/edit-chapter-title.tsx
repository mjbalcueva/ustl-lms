'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { TbEdit } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { editTitleSchema, type EditTitleSchema } from '@/shared/validations/chapter'

import { Button } from '@/client/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/client/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/client/components/ui/form'
import { Input } from '@/client/components/ui/input'

export const EditChapterTitleForm = ({ id, courseId, title }: EditTitleSchema) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const form = useForm<EditTitleSchema>({
		resolver: zodResolver(editTitleSchema),
		defaultValues: { id, courseId, title }
	})
	const formTitle = form.getValues('title')

	const { mutate, isPending } = api.chapter.editTitle.useMutation({
		onSuccess: (data) => {
			toggleEdit()
			form.reset({ id, courseId, title: data.newTitle })
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle>Title</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && formTitle && <TbEdit className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : formTitle ? 'Edit' : 'Add'}
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
											<Input placeholder="e.g. 'Week 1'" disabled={isPending} {...field} />
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
