'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
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

import {
	addCourseTagSchema,
	type AddCourseTagSchema
} from '@/features/courses/shared/validations/course-tags-schema'

type AddTagFormProps = React.ComponentPropsWithoutRef<typeof DialogTrigger>

export const AddTagForm = ({ ...props }: AddTagFormProps) => {
	const router = useRouter()
	const form = useForm<AddCourseTagSchema>({
		resolver: zodResolver(addCourseTagSchema),
		defaultValues: {
			name: ''
		}
	})

	const { mutate, isPending } =
		api.instructor.courseTags.addCourseTag.useMutation({
			onSuccess: async (data) => {
				form.reset()
				router.refresh()
				toast.success(data.message)
			},
			onError: (error) => toast.error(error.message)
		})

	return (
		<Dialog>
			<DialogTrigger {...props} />

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add new tag</DialogTitle>
					<DialogDescription>Add a new tag to your course.</DialogDescription>
				</DialogHeader>

				<Separator />

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((data) => mutate(data))}
						className="grid gap-4"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-card-foreground">
										Tag Name
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter a tag name"
											className="dark:!bg-card"
											{...field}
										/>
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
								>
									Cancel
								</Button>
							</DialogClose>
							<Button
								type="submit"
								disabled={isPending}
								variant={isPending ? 'shine' : 'default'}
							>
								{isPending ? 'Creating...' : 'Create Tag'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
