'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Assessment } from '@prisma/client'
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
import { Button } from '@/core/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/core/components/ui/form'
import { Input } from '@/core/components/ui/input'
import { Loader } from '@/core/components/ui/loader'
import { Add } from '@/core/lib/icons'

import { AssessmentList } from '@/features/chapters/components/chapter-assessment-list'
import {
	addChapterAssessmentSchema,
	type AddChapterAssessmentSchema
} from '@/features/chapters/validations/chapter-assessments-schema'

type AddChapterAssessmentsProps = {
	courseId: string
	chapterId: string
	assessments: Assessment[]
}

export const AddChapterAssessmentsForm = ({
	courseId,
	chapterId,
	assessments
}: AddChapterAssessmentsProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const form = useForm<AddChapterAssessmentSchema>({
		resolver: zodResolver(addChapterAssessmentSchema),
		defaultValues: {
			chapterId,
			title: ''
		}
	})
	const hasAssessments = assessments.length > 0

	const { mutate: editAssessmentOrder, isPending: isEditingAssessmentOrder } =
		api.chapter.editAssessmentOrder.useMutation({
			onSuccess: (data) => {
				toast.success(data.message)
				router.refresh()
			},
			onError: (error) => toast.error(error.message)
		})

	const onReorder = async (data: { id: string; position: number }[]) => {
		editAssessmentOrder({ chapterId, assessmentList: data })
	}

	const { mutate: addChapter, isPending: isAdding } = api.chapter.addAssessment.useMutation({
		onSuccess: async (data) => {
			toggleEdit()
			form.reset({
				chapterId,
				title: ''
			})
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card className="relative" showBorderTrail={isEditing || isEditingAssessmentOrder || isAdding}>
			{isEditingAssessmentOrder && (
				<div className="absolute flex h-full w-full items-center justify-center rounded-xl bg-background/40">
					<Loader variant="bars" size="medium" />
				</div>
			)}

			<CardHeader>
				<CardTitle>Assessment Builder</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="sm">
					{!isEditing && <Add />}
					{isEditing ? 'Cancel' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && (
				<CardContent isEmpty={!hasAssessments}>
					{!hasAssessments && 'No assessments'}
					<AssessmentList
						courseId={courseId}
						chapterId={chapterId}
						items={assessments}
						onReorder={onReorder}
					/>
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
												placeholder="e.g. 'Part 1: True or False'"
												disabled={isAdding}
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
					Drag and drop the assessments to reorder them
				</CardFooter>
			)}
		</Card>
	)
}
