'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChapterType, type Chapter } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { TbCirclePlus } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { addChapterSchema, type AddChapterSchema } from '@/shared/validations/chapter'

import { ChapterList } from '@/client/components/course/chapter-list'
import { Button } from '@/client/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/client/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/client/components/ui/form'
import { Input } from '@/client/components/ui/input'
import { Loader } from '@/client/components/ui/loader'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/client/components/ui/select'
import { capitalize } from '@/client/lib/utils'

type AddCourseChaptersProps = {
	courseId: string
	chapters: Chapter[]
}

export const AddCourseChaptersForm = ({ courseId, chapters }: AddCourseChaptersProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const form = useForm<AddChapterSchema>({
		resolver: zodResolver(addChapterSchema),
		defaultValues: {
			courseId,
			title: '',
			type: ChapterType.LESSON
		}
	})
	const hasChapters = chapters.length > 0

	const { mutate: reorderChapter, isPending: isChapterReordering } = api.chapter.reorderChapters.useMutation({
		onSuccess: (data) => toast.success(data.message),
		onError: (error) => toast.error(error.message)
	})

	const onReorder = async (data: { id: string; position: number }[]) => {
		reorderChapter({ courseId, chapterList: data })
	}

	const { mutate: addChapter, isPending: isAdding } = api.chapter.addChapter.useMutation({
		onSuccess: async (data) => {
			toggleEdit()
			form.reset({
				courseId,
				title: '',
				type: ChapterType.LESSON
			})
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card className="relative">
			{isChapterReordering && (
				<div className="absolute flex h-full w-full items-center justify-center rounded-xl bg-background/40">
					<Loader variant="bars" size="medium" />
				</div>
			)}

			<CardHeader>
				<CardTitle>Course Builder</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="card">
					{!isEditing && <TbCirclePlus className="mr-2 size-4" />}
					{isEditing ? 'Cancel' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && (
				<CardContent isEmpty={!hasChapters}>
					{!hasChapters && 'No chapters'}
					<ChapterList items={chapters} onReorder={onReorder} />
				</CardContent>
			)}

			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit((data) => addChapter(data))}>
						<CardContent className="flex gap-2">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormControl>
											<Input placeholder="e.g. 'Week 1'" disabled={isAdding} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem className="w-1/3">
										<Select onValueChange={field.onChange} defaultValue={ChapterType.LESSON}>
											<FormControl>
												<SelectTrigger className="bg-card dark:bg-background" disabled={isAdding}>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.values(ChapterType).map((type) => (
													<SelectItem key={type} value={type}>
														{capitalize(type)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>

						<CardFooter>
							<Button
								type="submit"
								size="card"
								disabled={!form.formState.isDirty || isAdding}
								variant={isAdding ? 'shine' : 'default'}
							>
								{isAdding ? 'Adding...' : 'Add'}
							</Button>
						</CardFooter>
					</form>
				</Form>
			)}

			{!isEditing && (
				<CardFooter className="text-sm text-muted-foreground">Drag and drop the chapters to reorder them</CardFooter>
			)}
		</Card>
	)
}
