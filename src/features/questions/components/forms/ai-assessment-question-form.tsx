'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { type Chapter } from '@prisma/client'
import { useForm } from 'react-hook-form'

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

import { ChaptersCombobox } from '@/features/questions/components/ui/chapters-combobox'
import { questionTypeWordMap } from '@/features/questions/lib/question-type-word-map'
import {
	aiAssessmentQuestionSchema,
	type AiAssessmentQuestionSchema
} from '@/features/questions/validations/assessment-questions-schema'

type AiAssessmentQuestionFormProps = {
	assessmentId: string
	chapters: Chapter[]
	onGenerate: (data: AiAssessmentQuestionSchema) => void
	isGenerating: boolean
}

export const AiAssessmentQuestionForm = ({
	assessmentId,
	chapters,
	onGenerate,
	isGenerating
}: AiAssessmentQuestionFormProps) => {
	const form = useForm<AiAssessmentQuestionSchema>({
		resolver: zodResolver(aiAssessmentQuestionSchema),
		defaultValues: {
			assessmentId,
			chapters: [],
			questionType: undefined,
			numberOfQuestions: 1,
			additionalPrompt: ''
		}
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
					<form onSubmit={form.handleSubmit(onGenerate)} className="space-y-4">
						<FormField
							control={form.control}
							name="chapters"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-card-foreground">Select Chapters</FormLabel>
									<FormControl>
										<ChaptersCombobox
											options={chapters.map((chapter) => ({
												value: chapter.id,
												label: chapter.title,
												content: chapter.content
											}))}
											selected={field.value.map((chapter) => chapter.id)}
											onChange={(selectedIds) => {
												const selectedChapters = selectedIds.map((id) => {
													const chapter = chapters.find((c) => c.id === id)!
													return {
														id: chapter.id,
														title: chapter.title,
														content: chapter.content
													}
												})
												field.onChange(selectedChapters)
											}}
											label="Search chapters..."
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
									<FormLabel className="text-card-foreground">Question Type</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger className="!bg-card">
												<SelectValue placeholder="Select question type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{Object.entries(questionTypeWordMap).map(([key, value]) => (
												<SelectItem key={key} value={key}>
													{value}
												</SelectItem>
											))}
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
									<FormLabel className="text-card-foreground">Number of Questions</FormLabel>
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
									<FormLabel className="text-card-foreground">Additional Prompt</FormLabel>
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
