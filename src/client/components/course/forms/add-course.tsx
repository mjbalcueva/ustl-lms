'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { createCourseSchema, type CreateCourseSchema } from '@/shared/validations/course'

import { Icons } from '@/client/components/icons'
import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Separator
} from '@/client/components/ui'

export const AddCourseForm = () => {
	const router = useRouter()

	const form = useForm<CreateCourseSchema>({
		resolver: zodResolver(createCourseSchema),
		defaultValues: {
			code: '',
			title: ''
		}
	})

	const { mutate, isPending } = api.course.createCourse.useMutation({
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
		<Dialog>
			<DialogTrigger asChild>
				<Button className="h-10 w-32">
					<Icons.plusCircle className="mr-1 size-5 shrink-0" />
					New Course
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create new course</DialogTitle>
					<DialogDescription>Create a new course to start teaching your students.</DialogDescription>
				</DialogHeader>
				<Separator />
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

							<DialogFooter>
								<DialogClose asChild>
									<Button type="button" variant="outline" className="rounded-md" onClick={() => form.reset()}>
										Cancel
									</Button>
								</DialogClose>
								<Button
									type="submit"
									disabled={isPending}
									variant={isPending ? 'shine' : 'default'}
									className="rounded-md"
								>
									{isPending ? 'Creating...' : 'Create Course'}
								</Button>
							</DialogFooter>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
