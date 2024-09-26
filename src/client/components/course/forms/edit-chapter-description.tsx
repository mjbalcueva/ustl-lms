'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { TbCirclePlus, TbEdit } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { editDescriptionSchema, type EditDescriptionSchema } from '@/shared/validations/chapter'

import { TiptapEditor } from '@/client/components/tiptap-editor'
import {
	Button,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from '@/client/components/ui'

type EditChapterDescriptionProps = {
	id: string
	courseId: string
	description: string | null
}

export const EditChapterDescriptionForm = ({ id, courseId, description }: EditChapterDescriptionProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const form = useForm<EditDescriptionSchema>({
		resolver: zodResolver(editDescriptionSchema),
		defaultValues: { id, courseId, description: description ?? '' }
	})
	const formDescription = form.getValues('description')

	const { mutate, isPending } = api.chapter.editDescription.useMutation({
		onSuccess: async (data) => {
			toggleEdit()
			form.reset({ id, courseId, description: data.newDescription ?? '' })
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle>Chapter Description</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && formDescription && <TbEdit className="mr-2 size-4" />}
					{!isEditing && !formDescription && <TbCirclePlus className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : formDescription ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && (
				<CardContent isEmpty={!formDescription}>
					{formDescription ? (
						<TiptapEditor content={formDescription} editable={false} injectCSS={true} />
					) : (
						'No description added'
					)}
				</CardContent>
			)}

			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit((data) => mutate(data))}>
						<CardContent>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<TiptapEditor
												placeholder="Add a description"
												throttleDelay={2000}
												output="html"
												autofocus={true}
												immediatelyRender={true}
												editable={true}
												injectCSS={true}
												onUpdate={field.onChange}
												{...field}
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
