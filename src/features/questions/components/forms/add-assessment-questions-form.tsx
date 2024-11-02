'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { QuestionType, type Question } from '@prisma/client'
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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/core/components/ui/form'
import { InputNumber } from '@/core/components/ui/input-number'
import { Loader } from '@/core/components/ui/loader'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/core/components/ui/select'
import { Textarea } from '@/core/components/ui/textarea'
import { Add } from '@/core/lib/icons'

import {
	addAssessmentQuestionsSchema,
	type AddAssessmentQuestionsSchema
} from '@/features/questions/validations/assessment-questions-schema'

type AddAssessmentQuestionsProps = {
	assessmentId: string
	questions: Question[]
}

export const AddAssessmentQuestionsForm = ({
	assessmentId,
	questions
}: AddAssessmentQuestionsProps) => {
	const router = useRouter()

	const [isEditing, setIsEditing] = React.useState(false)
	const toggleEdit = () => {
		setIsEditing((current) => !current)
		form.reset()
	}

	const form = useForm<AddAssessmentQuestionsSchema>({
		resolver: zodResolver(addAssessmentQuestionsSchema),
		defaultValues: {
			assessmentId,
			question: '',
			type: QuestionType.MULTIPLE_CHOICE
		}
	})
	const hasQuestions = questions.length > 0

	const { mutate: addQuestion, isPending: isAdding } = api.question.addQuestions.useMutation({
		onSuccess: async (data) => {
			toggleEdit()
			form.reset({
				assessmentId,
				question: '',
				type: QuestionType.MULTIPLE_CHOICE,
				points: 1
			})
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	const { isPending: isEditingQuestionOrder } = api.question.editQuestionOrder.useMutation({
		onSuccess: (data) => {
			toast.success(data.message)
			router.refresh()
		},
		onError: (error) => toast.error(error.message)
	})

	return (
		<Card className="relative" showBorderTrail={isEditing || isEditingQuestionOrder || isAdding}>
			{isEditingQuestionOrder && (
				<div className="absolute flex h-full w-full items-center justify-center rounded-xl bg-background/40">
					<Loader variant="bars" size="medium" />
				</div>
			)}

			<CardHeader>
				<CardTitle>{isEditing ? 'Add new questions' : 'Questions'}</CardTitle>
				<Button onClick={toggleEdit} variant="ghost" size="sm">
					{!isEditing && <Add />}
					{isEditing ? 'Cancel' : 'Add'}
				</Button>
			</CardHeader>

			{!isEditing && (
				<CardContent isEmpty={!hasQuestions}>
					{!hasQuestions && 'No questions have been added yet.'}
					{/* <ChapterList items={questions} onReorder={onReorder} /> */}
				</CardContent>
			)}

			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit((data) => addQuestion(data))}>
						<CardContent className="space-y-6 pb-6">
							<FormField
								control={form.control}
								name="question"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Question Text</FormLabel>
										<FormControl>
											<Textarea
												placeholder="e.g. 'What is the capital of France?'"
												disabled={isAdding}
												value={field.value ?? ''}
												onChange={field.onChange}
												onBlur={field.onBlur}
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
									<FormItem>
										<FormLabel>Question Type</FormLabel>
										<Select
											name="type"
											onValueChange={field.onChange}
											defaultValue={QuestionType.MULTIPLE_CHOICE}
										>
											<FormControl>
												<SelectTrigger disabled={isAdding}>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.values(QuestionType).map((type) => {
													const wordMap = {
														MULTIPLE_CHOICE: 'Multiple Choice',
														MULTIPLE_SELECT: 'Multiple Select',
														TRUE_OR_FALSE: 'True or False',
														ESSAY: 'Essay'
													}
													return (
														<SelectItem key={type} value={type}>
															{wordMap[type]}
														</SelectItem>
													)
												})}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="points"
								render={({ field }) => (
									<FormItem className="w-1/3">
										<FormLabel>Points</FormLabel>
										<FormControl>
											<InputNumber disabled={isAdding} {...field} />
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
								{isAdding ? 'Adding...' : 'Add Question'}
							</Button>
						</CardFooter>
					</form>
				</Form>
			)}

			{!isEditing && (
				<CardFooter className="text-sm text-muted-foreground">
					Drag and drop the questions to reorder them
				</CardFooter>
			)}
		</Card>
	)
}
