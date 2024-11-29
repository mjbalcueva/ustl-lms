'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api, type RouterOutputs } from '@/services/trpc/react'

import { Button } from '@/core/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/core/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/core/components/ui/form'
import { InputNumber } from '@/core/components/ui/input-number'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/core/components/ui/select'
import { Textarea } from '@/core/components/ui/textarea'
import { Ai } from '@/core/lib/icons'

import { ChaptersCombobox } from '@/features/assessment/instructor/components/ui/chapters-combobox'
import { questionTypeWordMap } from '@/features/assessment/shared/libs/question-type-word-map'
import {
	generateAssessmentQuestionSchema,
	type GenerateAssessmentQuestionSchema
} from '@/features/assessment/shared/validations/assessments-question-schema'

export const GenerateAssessmentQuestionForm = ({
	assessmentId,
	courseId
}: {
	assessmentId: RouterOutputs['instructor']['assessment']['findOneAssessment']['assessment']['assessmentId']
	courseId: RouterOutputs['instructor']['assessment']['findOneAssessment']['assessment']['chapter']['chapterId']
}) => {
	const router = useRouter()

	const form = useForm<GenerateAssessmentQuestionSchema>({
		resolver: zodResolver(generateAssessmentQuestionSchema),
		defaultValues: {
			assessmentId,
			chapters: [],
			questionType: undefined,
			numberOfQuestions: 0,
			additionalPrompt: ''
		}
	})

	const { data, isPending } =
		api.instructor.assessment.findManyLessons.useQuery({
			courseId: courseId
		})

	const { mutate: generateQuestions, isPending: isGenerating } =
		api.instructor.assessmentQuestion.generateAiQuestions.useMutation({
			onSuccess: (data) => {
				toast.success(data.message)
				router.refresh()
			},
			onError: (error) => toast.error(error.message)
		})

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" size="sm">
					<Ai /> Generate with AI
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Generate Questions with AI</DialogTitle>
					<DialogDescription>
						Configure AI to generate questions for your assessment.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((data) => {
							generateQuestions(data)
						})}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="chapters"
							render={({ field }) => (
								<FormItem>
									<div className="text-sm font-medium leading-none">
										Select Chapters
									</div>
									<FormControl>
										<ChaptersCombobox
											label="Search chapters..."
											isLoading={isPending}
											options={
												data?.lessons.map((lesson) => ({
													chapterId: lesson.chapterId,
													title: lesson.title,
													content: lesson.content ?? undefined
												})) ?? []
											}
											selected={field.value}
											onChange={(values) => field.onChange(values)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="questionType"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-card-foreground">
										Question Type
									</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger className="!bg-card">
												<SelectValue placeholder="Select question type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{Object.entries(questionTypeWordMap).map(
												([key, value]) => (
													<SelectItem key={key} value={key}>
														{value}
													</SelectItem>
												)
											)}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="numberOfQuestions"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-card-foreground">
										Number of Questions
									</FormLabel>
									<FormControl>
										<InputNumber className="!bg-card" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="additionalPrompt"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-card-foreground">
										Additional Prompt
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Enter any additional instructions for the AI..."
											className="!bg-card"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter className="gap-2 md:gap-0">
							<DialogClose asChild>
								<Button
									type="button"
									variant="outline"
									onClick={() => form.reset()}
									className="bg-card dark:bg-background dark:hover:bg-accent"
								>
									Done
								</Button>
							</DialogClose>
							<Button type="submit" disabled={isGenerating}>
								{isGenerating ? 'Generating...' : 'Generate Questions'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
