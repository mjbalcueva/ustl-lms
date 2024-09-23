'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { TbCirclePlus, TbEdit } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { editCourseCategorySchema, type EditCourseCategorySchema } from '@/shared/validations/category'

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

type EditCourseCategoryProps = {
	courseId: string
	categoryId: string
	options: {
		value: string
		label: string
	}[]
}

export const EditCourseCategoriesForm = ({ courseId, categoryId, options }: EditCourseCategoryProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const form = useForm<EditCourseCategorySchema>({
		resolver: zodResolver(editCourseCategorySchema),
		defaultValues: {
			courseId,
			categoryId
		}
	})
	const selectedCategory = options.find((option) => option.value === form.getValues('categoryId'))

	const { mutate, isPending } = api.category.editCategory.useMutation({
		onSuccess: async (data) => {
			toggleEdit()
			form.reset({
				courseId,
				categoryId: data.newCategoryId ?? ''
			})
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-col space-y-1.5">
					<CardTitle>Course Category</CardTitle>
				</div>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && categoryId && <TbEdit className="mr-2 size-4" />}
					{!isEditing && !categoryId && <TbCirclePlus className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : categoryId ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && (
				<CardContent isEmpty={!categoryId}>{categoryId ? selectedCategory?.label : 'No category selected'}</CardContent>
			)}

			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit((data) => mutate(data))}>
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
