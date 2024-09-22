'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { LuPencil, LuPlusCircle } from 'react-icons/lu'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { updateCategorySchema, type UpdateCategorySchema } from '@/shared/validations/category'

import {
	Button,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	Combobox,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from '@/client/components/ui'

type EditCategoryProps = {
	courseId: string
	categoryId: string
	options: {
		value: string
		label: string
	}[]
}

export const EditCategoriesForm = ({ courseId, categoryId, options }: EditCategoryProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => setIsEditing((current) => !current)

	const form = useForm<UpdateCategorySchema>({
		resolver: zodResolver(updateCategorySchema),
		defaultValues: {
			courseId,
			categoryId
		}
	})

	const { mutate, isPending } = api.category.updateCategory.useMutation({
		onSuccess: async (data) => {
			router.refresh()
			form.reset({
				courseId,
				categoryId: data.course.categoryId ?? ''
			})
			toggleEdit()
			toast.success(data.message)
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	const onSubmit: SubmitHandler<UpdateCategorySchema> = (data) => mutate(data)

	const selectedCategory = options.find((option) => option.value === form.getValues('categoryId'))

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-col space-y-1.5">
					<CardTitle>Course Category</CardTitle>
				</div>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && categoryId && <LuPencil className="mr-2 size-4" />}
					{!isEditing && !categoryId && <LuPlusCircle className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : categoryId ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && (
				<CardContent isEmpty={!categoryId}>{categoryId ? selectedCategory?.label : 'No category selected'}</CardContent>
			)}

			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent>
							<FormField
								control={form.control}
								name="categoryId"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Combobox
												options={options}
												selected={field.value}
												onChange={field.onChange}
												label="Select Category..."
											/>
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
