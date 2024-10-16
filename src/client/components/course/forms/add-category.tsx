'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { addCategorySchema, type AddCategorySchema } from '@/shared/validations/category'

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

type AddCategoryFormProps = React.ComponentPropsWithoutRef<typeof DialogTrigger>

export const AddCategoryForm = ({ ...props }: AddCategoryFormProps) => {
	const router = useRouter()
	const form = useForm<AddCategorySchema>({
		resolver: zodResolver(addCategorySchema),
		defaultValues: {
			name: ''
		}
	})

	const { mutate, isPending } = api.category.addCategory.useMutation({
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
					<DialogTitle>Add new category</DialogTitle>
					<DialogDescription>Add a new category to your course.</DialogDescription>
				</DialogHeader>

				<Separator />

				<Form {...form}>
					<form onSubmit={form.handleSubmit((data) => mutate(data))} className="grid gap-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-card-foreground">Category Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter a category name" className="dark:!bg-card" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<DialogClose asChild>
								<Button type="button" variant="outline" onClick={() => form.reset()}>
									Cancel
								</Button>
							</DialogClose>
							<Button type="submit" disabled={isPending} variant={isPending ? 'shine' : 'default'}>
								{isPending ? 'Creating...' : 'Create Category'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
