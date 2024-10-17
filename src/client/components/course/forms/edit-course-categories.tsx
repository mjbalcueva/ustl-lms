'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Category } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { TbEdit } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { editCourseCategoriesSchema, type EditCourseCategoriesSchema } from '@/shared/validations/category'

import { CategoriesCombobox } from '@/client/components/course/categories-combobox'
import { Badge } from '@/client/components/ui/badge'
import { Button } from '@/client/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/client/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/client/components/ui/form'

type EditCourseCategoriesProps = {
	id: string
	categories: Category[]
	categoriesOptions: Category[]
}

export const EditCourseCategoriesForm = ({ id, categories, categoriesOptions }: EditCourseCategoriesProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)

	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const categoryIds = categories.map((category) => category.id)

	const form = useForm<EditCourseCategoriesSchema>({
		resolver: zodResolver(editCourseCategoriesSchema),
		defaultValues: { id, categoryIds }
	})

	const { mutate, isPending } = api.category.editCategories.useMutation({
		onSuccess: async (data) => {
			toggleEdit()
			form.reset({ id, categoryIds: data.newCategoryIds })
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-col space-y-1.5">
					<CardTitle>Course Tags</CardTitle>
				</div>

				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && <TbEdit className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : 'Edit'}
				</Button>
			</CardHeader>

			{!isEditing && (
				<CardContent isEmpty={categoryIds.length === 0}>
					{categoryIds.length > 0 ? (
						<div className="flex flex-wrap gap-1">
							{categoryIds.map((id) => (
								<Badge key={id} variant="secondary">
									{categories.find((cat) => cat.id === id)?.name}
								</Badge>
							))}
						</div>
					) : (
						'No tags selected'
					)}
				</CardContent>
			)}

			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit((data) => mutate(data))}>
						<CardContent>
							<FormField
								control={form.control}
								name="categoryIds"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<CategoriesCombobox
												options={categoriesOptions.map((category) => ({ value: category.id, label: category.name }))}
												selected={field.value}
												onChange={field.onChange}
												label="Search tags..."
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
