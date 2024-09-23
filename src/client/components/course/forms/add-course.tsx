'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { TbCirclePlus } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { addCourseSchema, type AddCourseSchema } from '@/shared/validations/course'

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

	const form = useForm<AddCourseSchema>({
		resolver: zodResolver(addCourseSchema),
		defaultValues: {
			code: '',
			title: ''
		}
	})

	const { mutate, isPending } = api.course.addCourse.useMutation({
		onSuccess: async (data) => {
			form.reset()
			router.push(`/courses/edit/${data.newCourseId}`)
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="h-10 w-32">
					<TbCirclePlus className="mr-1 size-5 shrink-0" />
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
					<form onSubmit={form.handleSubmit((data) => mutate(data))}>
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
