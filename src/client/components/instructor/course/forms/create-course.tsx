'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { createCourseSchema, type CreateCourseSchema } from '@/shared/validations/course'

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/client/components/ui'

export const CreateCourseForm = () => {
	const router = useRouter()

	const form = useForm<CreateCourseSchema>({
		resolver: zodResolver(createCourseSchema),
		defaultValues: {
			code: '',
			title: ''
		}
	})

	const { mutate } = api.course.createCourse.useMutation({
		onSuccess: async (data) => {
			form.reset()
			router.push(`/courses/edit/${data.course.id}`)
			toast.success(data.message)
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	const onSubmit: SubmitHandler<CreateCourseSchema> = (data) => mutate(data)

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="grid gap-4">
					<FormField
						control={form.control}
						name="code"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-card-foreground">Course Code</FormLabel>
								<FormControl>
									<Input placeholder="Enter a course code" className="!bg-card" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-card-foreground">Course Name</FormLabel>
								<FormControl>
									<Input placeholder="Enter a new name" className="!bg-card" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex justify-end gap-2">
						<Button type="button" variant="outline" className="rounded-md">
							Cancel
						</Button>
						<Button type="submit" className="rounded-md">
							Create Course
						</Button>
					</div>
				</div>
			</form>
		</Form>
	)
}
