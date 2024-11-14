'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '@/services/trpc/react'

import { Button } from '@/core/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/core/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/core/components/ui/form'
import { Input } from '@/core/components/ui/input'
import { Separator } from '@/core/components/ui/separator'
import { Add } from '@/core/lib/icons'

import { addCourseSchema, type AddCourseSchema } from '@/features/courses/validations/course-schema'

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
			router.push(`/instructor/courses/${data.newCourseId}`)
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="h-10 w-32">
					<Add className="!size-5 shrink-0" />
					New Course
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create new course</DialogTitle>
					<DialogDescription>
						Create a new course to start teaching your students.
					</DialogDescription>
				</DialogHeader>
				<Separator />
				<Form {...form}>
					<form onSubmit={form.handleSubmit((data) => mutate(data))} className="grid gap-4">
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

						<DialogFooter className="gap-2 md:gap-0">
							<DialogClose asChild>
								<Button
									type="button"
									variant="outline"
									onClick={() => form.reset()}
									className="bg-card dark:bg-background dark:hover:bg-accent"
								>
									Cancel
								</Button>
							</DialogClose>
							<Button type="submit" disabled={isPending} variant={isPending ? 'shine' : 'default'}>
								{isPending ? 'Creating...' : 'Create Course'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
