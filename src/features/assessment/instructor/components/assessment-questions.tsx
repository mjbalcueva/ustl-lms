'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

import { api, type RouterOutputs } from '@/services/trpc/react'

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/core/components/compound-card'
import { Loader } from '@/core/components/ui/loader'

import { QuestionList } from '@/features/assessment/instructor/components/assessment-question-list'
import { AddAssessmentQuestionForm } from '@/features/assessment/instructor/components/forms/add-assessment-question-form'

export const AssessmentQuestions = ({
	assessmentId,
	// lessons,
	questions
}: {
	assessmentId: RouterOutputs['instructor']['assessment']['findOneAssessment']['assessment']['assessmentId']
	lessons: RouterOutputs['instructor']['assessment']['findManyLessons']['lessons']
	questions: RouterOutputs['instructor']['assessment']['findOneAssessment']['assessment']['questions']
}) => {
	const router = useRouter()
	const hasQuestions = questions.length > 0

	const { mutate: editQuestionOrder, isPending: isEditingQuestionOrder } =
		api.instructor.assessmentQuestion.editOrder.useMutation({
			onSuccess: (data) => {
				toast.success(data.message)
				router.refresh()
			},
			onError: (error) => toast.error(error.message)
		})

	// const { mutate: generateQuestions, isPending: isGenerating } =
	// 	api.instructor.assessmentQuestion.generateAiQuestions.useMutation({
	// 		onSuccess: (data) => {
	// 			toast.success(data.message)
	// 			router.refresh()
	// 		},
	// 		onError: (error) => toast.error(error.message)
	// 	})

	// const handleGenerateQuestions = (
	// 	data: GenerateAiAssessmentQuestionSchema
	// ) => {
	// 	generateQuestions({ ...data, assessmentId })
	// }

	const onReorder = async (
		data: { questionId: string; position: number }[]
	) => {
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
					{/* <AiAssessmentQuestionForm
						assessmentId={assessmentId}
						chapters={lessons}
						onGenerate={handleGenerateQuestions}
						isGenerating={isGenerating}
					/>
				 */}
					<AddAssessmentQuestionForm assessmentId={assessmentId} />
				</div>
			</CardHeader>

			<CardContent isEmpty={!hasQuestions}>
				{!hasQuestions && 'No questions have been added yet.'}
				<QuestionList questionList={questions} onReorder={onReorder} />
			</CardContent>

			<CardFooter className="text-sm text-muted-foreground">
				Drag and drop to reorder questions, or use settings to enable question
				and option shuffling
			</CardFooter>
		</Card>
	)
}
