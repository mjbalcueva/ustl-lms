'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { TbCirclePlus, TbEdit } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { editContentSchema, type EditContentSchema } from '@/shared/validations/chapter'

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

type EditChapterContentProps = {
	id: string
	courseId: string
	content: string | null
}

export const EditChapterContentForm = ({ id, courseId, content }: EditChapterContentProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const form = useForm<EditContentSchema>({
		resolver: zodResolver(editContentSchema),
		defaultValues: { id, courseId, content: content ?? '' }
	})
	const formContent = form.getValues('content')

	const { mutate, isPending } = api.chapter.editContent.useMutation({
		onSuccess: async (data) => {
			toggleEdit()
			form.reset({ id, courseId, content: data.newContent ?? '' })
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle>Content</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && formContent && <TbEdit className="mr-2 size-4" />}
					{!isEditing && !formContent && <TbCirclePlus className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : formContent ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && (
				<CardContent isEmpty={!formContent}>
					{formContent ? (
						<TiptapEditor content={formContent} editable={false} injectCSS={true} immediatelyRender={false} />
					) : (
						'No content added'
					)}
				</CardContent>
			)}

			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit((data) => mutate(data))}>
						<CardContent>
							<FormField
								control={form.control}
								name="content"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<TiptapEditor
												placeholder="Add a content"
												throttleDelay={2000}
												output="html"
												autofocus={true}
												immediatelyRender={false}
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
