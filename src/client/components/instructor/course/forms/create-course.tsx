'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { createCourseSchema, type CreateCourseSchema } from '@/shared/validations/course'

import {
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemHeader,
	ItemTitle,
	ItemWrapper
} from '@/client/components/item-wrapper'
import { Loader } from '@/client/components/loader'
import {
	Button,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input
} from '@/client/components/ui'

export const CreateCourseForm = () => {
	const router = useRouter()

	const form = useForm<CreateCourseSchema>({
		resolver: zodResolver(createCourseSchema),
		defaultValues: {
			title: ''
		}
	})

	const { mutate, isPending } = api.course.createCourse.useMutation({
		onSuccess: async (data) => {
			form.reset()
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	const onSubmit: SubmitHandler<CreateCourseSchema> = (data) => mutate(data)

	return (
		<ItemWrapper className="w-full">
			<ItemHeader>
				<ItemTitle className="text-2xl font-semibold">Name your course</ItemTitle>
				<ItemDescription>
					What do you want to call your course? Don&apos;t worry, you can change this later.
				</ItemDescription>
			</ItemHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<ItemContent>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-card-foreground">Course Title</FormLabel>
									<FormControl>
										<Input className="rounded-xl sm:w-3/5" placeholder="Enter a new name" {...field} />
									</FormControl>
									<FormDescription>What will you teach in this course?</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</ItemContent>

					<ItemFooter className="justify-end gap-3">
						<Button variant="outline" className="flex h-8 gap-1 text-sm">
							Cancel
						</Button>
						<Button className="flex h-8 gap-1 text-sm">
							{isPending && <Loader />}
							{isPending ? 'Saving...' : 'Save'}
						</Button>
					</ItemFooter>
				</form>
			</Form>
		</ItemWrapper>
	)
}
