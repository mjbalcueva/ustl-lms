'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Chapter } from '@prisma/client'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { LuPlusCircle } from 'react-icons/lu'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { createChapterSchema, type CreateChapterSchema } from '@/shared/validations/chapter'

import {
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	CardWrapper
} from '@/client/components/instructor/course/card-wrapper'
import { ChapterList } from '@/client/components/instructor/course/chapter-list'
import { Button, Form, FormControl, FormField, FormItem, FormMessage, Input, Loader } from '@/client/components/ui'

type UpdateDescriptionProps = {
	courseId: string
	initialData: {
		chapters: Chapter[]
	}
}

export const CreateChapters = ({ courseId, initialData }: UpdateDescriptionProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => setIsEditing((current) => !current)

	const form = useForm<CreateChapterSchema>({
		resolver: zodResolver(createChapterSchema),
		defaultValues: {
			courseId,
			title: ''
		}
	})

	const onEdit = (id: string) => {
		router.push(`/courses/edit/${courseId}/chapters/${id}`)
	}

	const { mutate: reorder, isPending: isReordering } = api.chapter.reorderChapters.useMutation({
		onSuccess: (data) => {
			toast.success(data.message)
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	const onReorder = async (data: { id: string; position: number }[]) => reorder({ courseId, chapterList: data })

	const { mutate: create, isPending: isCreating } = api.chapter.createChapter.useMutation({
		onSuccess: async (data) => {
			router.refresh()
			form.reset({
				courseId,
				title: ''
			})
			toggleEdit()
			toast.success(data.message)
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	const onSubmit: SubmitHandler<CreateChapterSchema> = (data) => create(data)

	const hasChapters = initialData.chapters.length > 0

	return (
		<CardWrapper className="relative">
			{isReordering && (
				<div className="absolute flex h-full w-full items-center justify-center rounded-xl bg-background/40">
					<Loader variant="bars" size="medium" />
				</div>
			)}

			<CardHeader>
				<CardTitle>Course Chapters</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && <LuPlusCircle className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && (
				<CardContent isEmpty={!hasChapters}>
					{!hasChapters && 'No chapters'}
					<ChapterList items={initialData.chapters} onEdit={onEdit} onReorder={onReorder} />
				</CardContent>
			)}

			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent>
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormControl>
											<Input placeholder="e.g. 'Introduction to the course'" disabled={isCreating} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter>
							<Button type="submit" size="card" disabled={!form.formState.isDirty || isCreating}>
								Add
							</Button>
						</CardFooter>
					</form>
				</Form>
			)}

			{!isEditing && (
				<CardFooter>
					<span className="text-sm text-muted-foreground">Drag and drop the chapters to reorder them</span>
				</CardFooter>
			)}
		</CardWrapper>
	)
}
