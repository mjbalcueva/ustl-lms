'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { createCourseSchema, type CreateCourseSchema } from '@/shared/validations/course'

import { Icons } from '@/client/components/icons'
import {
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemFooterDescription,
	ItemHeader,
	ItemTitle,
	ItemWrapper
} from '@/client/components/item-wrapper'
import { Loader } from '@/client/components/loader'
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
		<ItemWrapper className="h-fit w-full">
			<ItemHeader>
				<ItemTitle className="text-2xl font-semibold">Name your course</ItemTitle>
				<ItemDescription>What do you want to call your course?</ItemDescription>
			</ItemHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<ItemContent withSeparator>
						<div className="grid grid-cols-3 grid-rows-2 gap-4 md:grid-rows-1">
							<FormField
								control={form.control}
								name="code"
								render={({ field }) => (
									<FormItem className="col-span-2 row-start-1 md:col-span-1">
										<FormLabel className="text-card-foreground">Course Code</FormLabel>
										<FormControl>
											<Input className="rounded-xl" placeholder="Enter a course code" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem className="col-span-3 row-start-2 md:col-span-2">
										<FormLabel className="text-card-foreground">Course Title</FormLabel>
										<FormControl>
											<Input className="rounded-xl" placeholder="Enter a new name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</ItemContent>

					<ItemFooter className="justify-end md:justify-between">
						<div className="hidden items-center gap-1 sm:flex">
							<Icons.info className="h-4 w-4 shrink-0 text-muted-foreground" />
							<ItemFooterDescription>You can still change this later.</ItemFooterDescription>
						</div>
						<div className="flex gap-3">
							<Button variant="outline" className="flex h-8 gap-1 text-sm" type="button" onClick={() => router.back()}>
								Cancel
							</Button>
							<Button className="flex h-8 gap-1 text-sm" type="submit" disabled={isPending}>
								{isPending && <Loader />}
								{isPending ? 'Saving...' : 'Save'}
							</Button>
						</div>
					</ItemFooter>
				</form>
			</Form>
		</ItemWrapper>
	)
}
