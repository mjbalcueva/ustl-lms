'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChapterType } from '@prisma/client'
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
import { Button } from '@/core/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from '@/core/components/ui/form'
import { Input } from '@/core/components/ui/input'
import { Loader } from '@/core/components/ui/loader'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/core/components/ui/select'
import { Add } from '@/core/lib/icons'
import { capitalize } from '@/core/lib/utils/capitalize'

import { ChapterList } from '@/features/courses/instructor/components/course-chapter-list'
import {
	addCourseChapterSchema,
	type AddCourseChapterSchema
} from '@/features/courses/validations/course-chapters-schema'

export const AddCourseChaptersForm = ({
	courseId,
	chapters
}: {
	courseId: RouterOutputs['instructor']['course']['findOneCourse']['course']['courseId']
	chapters: RouterOutputs['instructor']['course']['findOneCourse']['course']['chapters']
}) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const form = useForm<AddCourseChapterSchema>({
		resolver: zodResolver(addCourseChapterSchema),
		defaultValues: {
			courseId,
			title: '',
			type: ChapterType.LESSON
		}
	})
	const hasChapters = chapters.length > 0

	const { mutate: editChapterOrder, isPending: isEditingChapterOrder } =
		api.instructor.course.editChapterOrder.useMutation({
			onSuccess: (data) => {
				toast.success(data.message)
				router.refresh()
			},
			onError: (error) => toast.error(error.message)
		})

	const onReorder = async (data: { chapterId: string; position: number }[]) => {
		editChapterOrder({ courseId, chapterList: data })
	}

	const { mutate: addChapter, isPending: isAdding } =
		api.instructor.course.addChapter.useMutation({
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
		<Card
			className="relative"
			showBorderTrail={isEditing || isEditingChapterOrder || isAdding}
		>
			{isEditingChapterOrder && (
				<div className="absolute flex h-full w-full items-center justify-center rounded-xl bg-background/40">
					<Loader variant="bars" size="medium" />
				</div>
			)}

			<CardHeader>
				<CardTitle>Course Builder</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="sm">
					{!isEditing && <Add />}
					{isEditing ? 'Cancel' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && (
				<CardContent isEmpty={!hasChapters}>
					{!hasChapters && 'No chapters'}
					<ChapterList chapters={chapters} onReorder={onReorder} />
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
											<Input
												placeholder="e.g. 'Week 1'"
												disabled={isAdding}
												{...field}
											/>
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
										<Select
											name="type"
											onValueChange={field.onChange}
											defaultValue={ChapterType.LESSON}
										>
											<FormControl>
												<SelectTrigger
													className="bg-card dark:bg-background"
													disabled={isAdding}
												>
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
								size="sm"
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
				<CardFooter className="text-sm text-muted-foreground">
					Drag and drop the chapters to reorder them
				</CardFooter>
			)}
		</Card>
	)
}
