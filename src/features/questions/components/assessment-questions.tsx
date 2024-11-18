'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { QuestionType, type Chapter, type Question } from '@prisma/client'
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
import { Loader } from '@/core/components/ui/loader'

import { AddAssessmentQuestionForm } from '@/features/questions/components/forms/add-assessment-question-form'
import { AiAssessmentQuestionForm } from '@/features/questions/components/forms/ai-assessment-question-form'
import {
	addAssessmentQuestionSchema,
	type AddAssessmentQuestionSchema,
	type AiAssessmentQuestionSchema
} from '@/features/questions/validations/assessment-questions-schema'

import { QuestionList } from './assessment-question-list'

type AssessmentQuestionsProps = {
	assessmentId: string
	chapters: Chapter[]
	questions: Question[]
}

export const AssessmentQuestions = ({
	assessmentId,
	chapters,
	questions
}: AssessmentQuestionsProps) => {
	const router = useRouter()
	const hasQuestions = questions.length > 0

	const form = useForm<AddAssessmentQuestionSchema>({
		resolver: zodResolver(addAssessmentQuestionSchema),
		defaultValues: {
			assessmentId,
			question: '',
			type: QuestionType.MULTIPLE_CHOICE,
			options: {
				type: QuestionType.MULTIPLE_CHOICE,
				options: [] as string[]
			},
			points: 1
		}
	})

	const { mutate: addQuestion, isPending: isAdding } = api.question.addQuestions.useMutation({
		onSuccess: async (data) => {
			form.reset({
				assessmentId,
				question: '',
				type: QuestionType.MULTIPLE_CHOICE,
				options: {
					type: QuestionType.MULTIPLE_CHOICE,
					options: [] as string[]
				}
			})
			router.refresh()
			toast.success(data.message)
		},
		onError: (error) => toast.error(error.message)
	})

	const { mutate: editQuestionOrder, isPending: isEditingQuestionOrder } =
		api.question.editQuestionOrder.useMutation({
			onSuccess: (data) => {
				toast.success(data.message)
				router.refresh()
			},
			onError: (error) => toast.error(error.message)
		})

	const { mutate: generateQuestions, isPending: isGenerating } =
		api.question.generateQuestions.useMutation({
			onSuccess: (data) => {
				router.refresh()
				toast.success(data.message)
			},
			onError: (error) => toast.error(error.message)
		})

	const handleGenerateQuestions = (data: AiAssessmentQuestionSchema) => {
		generateQuestions({ ...data, assessmentId })
	}

	const onReorder = async (data: { id: string; position: number }[]) => {
		editQuestionOrder({ assessmentId, questionList: data })
	}

	return (
		<Card className="relative">
			{isEditingQuestionOrder && (
				<div className="absolute flex h-full w-full items-center justify-center rounded-xl bg-background/40">
					<Loader variant="bars" size="medium" />
				</div>
			)}

			<CardHeader>
				<CardTitle>Questions</CardTitle>

				<div className="flex items-center gap-2">
					<AiAssessmentQuestionForm
						assessmentId={assessmentId}
						chapters={chapters}
						onGenerate={handleGenerateQuestions}
						isGenerating={isGenerating}
					/>
					<AddAssessmentQuestionForm form={form} addQuestion={addQuestion} isAdding={isAdding} />
				</div>
			</CardHeader>

			<CardContent isEmpty={!hasQuestions}>
				{!hasQuestions && 'No questions have been added yet.'}
				<QuestionList items={questions} onReorder={onReorder} />
			</CardContent>

			<CardFooter className="text-sm text-muted-foreground">
				Drag and drop to reorder questions, or use settings to enable question and option shuffling
			</CardFooter>
		</Card>
	)
}
