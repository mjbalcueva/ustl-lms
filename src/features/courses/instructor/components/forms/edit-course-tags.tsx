'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api, type RouterOutputs } from '@/services/trpc/react'

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/core/components/compound-card'
import { Badge } from '@/core/components/ui/badge'
import { Button } from '@/core/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from '@/core/components/ui/form'
import { Edit } from '@/core/lib/icons'

import { TagsCombobox } from '@/features/courses/instructor/components/ui/tags-combobox'
import {
	editManyCourseTagsSchema,
	type EditManyCourseTagsSchema
} from '@/features/courses/shared/validations/course-tags-schema'

export const EditCourseTagsForm = ({
	courseId,
	tags,
	tagsOptions
}: {
	courseId: RouterOutputs['instructor']['course']['findOneCourse']['course']['courseId']
	tags: RouterOutputs['instructor']['course']['findOneCourse']['course']['tags']
	tagsOptions: RouterOutputs['instructor']['courseTags']['findManyCourseTags']['tags']
}) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)

	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const tagIds = tags.map((tag) => tag.tagId)

	const form = useForm<EditManyCourseTagsSchema>({
		resolver: zodResolver(editManyCourseTagsSchema),
		defaultValues: { courseId, tagIds }
	})

	const { mutate, isPending } =
		api.instructor.courseTags.editManyCourseTags.useMutation({
			onSuccess: async (data) => {
				toggleEdit()
				form.reset({ courseId, tagIds: data.newTagIds })
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
				<CardContent isEmpty={tagIds.length === 0}>
					{tagIds.length > 0 ? (
						<div className="flex flex-wrap gap-1">
							{tagIds.map((id) => (
								<Badge key={id} variant="secondary">
									{tags.find((tag) => tag.tagId === id)?.name}
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
								name="tagIds"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<TagsCombobox
												options={tagsOptions.map((tag) => ({
													value: tag.tagId,
													label: tag.name
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
