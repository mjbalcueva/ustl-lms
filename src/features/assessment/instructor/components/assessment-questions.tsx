'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { AssessmentQuestionType } from '@prisma/client'
// import { useForm } from 'react-hook-form'
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

import '@/features/assessment/shared/validations/assessments-question-schema' // addAssessmentQuestionSchema,

// GenerateAiAssessmentQuestionSchema,
// type AddAssessmentQuestionSchema

import { QuestionList } from './assessment-question-list'

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

	// const form = useForm<AddAssessmentQuestionSchema>({
	// 	resolver: zodResolver(addAssessmentQuestionSchema),
	// 	defaultValues: {
	// 		assessmentId,
	// 		question: '',
	// 		questionType: AssessmentQuestionType.MULTIPLE_CHOICE,
	// 		options: {
	// 			type: AssessmentQuestionType.MULTIPLE_CHOICE,
	// 			options: [] as string[]
	// 		},
	// 		points: 1
	// 	}
	// })

	// const { mutate: addQuestion, isPending: isAdding } =
	// 	api.instructor.assessmentQuestion.addQuestion.useMutation({
	// 		onSuccess: async (data) => {
	// 			form.reset({
	// 				assessmentId,
	// 				question: '',
	// 				questionType: AssessmentQuestionType.MULTIPLE_CHOICE,
	// 				options: {
	// 					type: AssessmentQuestionType.MULTIPLE_CHOICE,
	// 					options: [] as string[]
	// 				}
	// 			})
	// 			router.refresh()
	// 			toast.success(data.message)
	// 		},
	// 		onError: (error) => toast.error(error.message)
	// 	})

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
					{/* <AiAssessmentQuestionForm
						assessmentId={assessmentId}
						chapters={lessons}
						onGenerate={handleGenerateQuestions}
						isGenerating={isGenerating}
					/>
					<AddAssessmentQuestionForm
						form={form}
						addQuestion={addQuestion}
						isAdding={isAdding}
					/> */}
				</div>
			</CardHeader>

			<CardContent isEmpty={!hasQuestions}>
				{!hasQuestions && 'No questions have been added yet.'}
				<QuestionList items={questions} onReorder={onReorder} />
			</CardContent>

			<CardFooter className="text-sm text-muted-foreground">
				Drag and drop to reorder questions, or use settings to enable question
				and option shuffling
			</CardFooter>
		</Card>
	)
}
