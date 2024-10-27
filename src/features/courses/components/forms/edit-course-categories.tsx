'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Category } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '@/services/trpc/react'

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/core/components/compound-card'
import { Badge } from '@/core/components/ui/badge'
import { Button } from '@/core/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/core/components/ui/form'
import { Edit } from '@/core/lib/icons'

import { CategoriesCombobox } from '@/features/courses/components/ui/categories-combobox'
import {
	editManyCourseCategoriesSchema,
	type EditManyCourseCategoriesSchema
} from '@/features/courses/validations/course-categories-schema'

type EditCourseCategoriesProps = {
	id: string
	categories: Category[]
	categoriesOptions: Category[]
}

export const EditCourseCategoriesForm = ({
	id,
	categories,
	categoriesOptions
}: EditCourseCategoriesProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)

	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const categoryIds = categories.map((category) => category.id)

	const form = useForm<EditManyCourseCategoriesSchema>({
		resolver: zodResolver(editManyCourseCategoriesSchema),
		defaultValues: { id, categoryIds }
	})

	const { mutate, isPending } = api.course.editCategories.useMutation({
		onSuccess: async (data) => {
			toggleEdit()
			form.reset({ id, categoryIds: data.newCategoryIds })
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card showBorderTrail={isEditing}>
			<CardHeader>
				<div className="flex flex-col space-y-1.5">
					<CardTitle>Course Tags</CardTitle>
				</div>

				<Button onClick={toggleEdit} variant="ghost" size="sm">
					{!isEditing && <Edit />}
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
												options={categoriesOptions.map((category) => ({
													value: category.id,
													label: category.name
												}))}
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
								size="sm"
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
