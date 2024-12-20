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
import { ContentViewer } from '@/core/components/tiptap-editor/content-viewer'
import { Button } from '@/core/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from '@/core/components/ui/form'
import { Separator } from '@/core/components/ui/separator'
import { Add, Edit } from '@/core/lib/icons'

import { Editor } from '@/features/chapters/instructor/components/editor/editor'
import {
	editChapterContentSchema,
	type EditChapterContentSchema
} from '@/features/chapters/shared/validations/chapter-schema'

export const EditChapterContentForm = ({
	chapterId,
	content
}: {
	chapterId: RouterOutputs['instructor']['chapter']['findOneChapter']['chapter']['chapterId']
	content: RouterOutputs['instructor']['chapter']['findOneChapter']['chapter']['content']
}) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const form = useForm<EditChapterContentSchema>({
		resolver: zodResolver(editChapterContentSchema),
		defaultValues: { chapterId, content: content ?? '' }
	})
	const formContent = form.getValues('content')

	const { mutate, isPending } = api.instructor.chapter.editContent.useMutation({
		onSuccess: async (data) => {
			toggleEdit()
			form.reset({
				chapterId,
				content: data.updatedChapter.content ?? ''
			})
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card showBorderTrail={isEditing}>
			<CardHeader>
				<CardTitle>Content</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="sm">
					{!isEditing && (formContent ? <Edit /> : <Add />)}
					{isEditing ? 'Cancel' : formContent ? 'Edit' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && (
				<CardContent isEmpty={!formContent}>
					{formContent ? (
						<>
							<Separator className="mb-4" />
							<ContentViewer value={formContent} />
						</>
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
											<Editor
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
