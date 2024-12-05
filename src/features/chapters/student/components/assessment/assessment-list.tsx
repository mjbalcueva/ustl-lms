'use client'

import * as React from 'react'
import { useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Prisma } from '@prisma/client'
import { useForm } from 'react-hook-form'

import { type RouterOutputs } from '@/services/trpc/react'

import { Button } from '@/core/components/ui/button'
import { Form } from '@/core/components/ui/form'

import { shuffle } from '@/features/assessment/shared/lib/shuffle'
import {
	submitAssessmentAnswersSchema,
	type SubmitAssessmentAnswers
} from '@/features/assessment/shared/validations/student-answer-schema'
import { AssessmentCard } from '@/features/chapters/student/components/assessment/assessment-card'
import { AssessmentCardContent } from '@/features/chapters/student/components/assessment/assessment-card-content'
import { AssessmentCardHeader } from '@/features/chapters/student/components/assessment/assessment-card-header'
import { AssessmentQuestionCard } from '@/features/chapters/student/components/assessment/assessment-question-card'
import { useSubmitAssessment } from '@/features/chapters/student/hooks/use-submit-answer'

type AssessmentListProps = {
	assessments: NonNullable<
		RouterOutputs['student']['chapter']['findOneChapter']['chapter']
	>['assessments']
}

export const AssessmentList = ({ assessments }: AssessmentListProps) => {
	const { handleSubmitAssessment, isSubmitting } = useSubmitAssessment()

	const shuffledAssessments = useMemo(() => {
		return assessments.map((assessment) => {
			const questions = assessment.shuffleQuestions
				? shuffle([...assessment.questions])
				: assessment.questions

			const questionsWithShuffledOptions = questions.map((question) => {
				if (
					!assessment.shuffleOptions ||
					!question.options ||
					question.questionType === 'TRUE_OR_FALSE'
				) {
					return question
				}

				return {
					...question,
					options: shuffle(
						question.options as Prisma.JsonArray
					) as Prisma.JsonValue
				}
			})

			return {
				...assessment,
				questions: questionsWithShuffledOptions
			}
		})
	}, [assessments])

	const form = useForm<SubmitAssessmentAnswers>({
		resolver: zodResolver(submitAssessmentAnswersSchema),
		defaultValues: {
			assessmentId: shuffledAssessments[0]?.assessmentId ?? '',
			answers: shuffledAssessments.flatMap((assessment) =>
				assessment.questions.map((question) => {
					switch (question.questionType) {
						case 'MULTIPLE_CHOICE':
							return {
								questionId: question.questionId,
								questionType: 'MULTIPLE_CHOICE',
								answer: ''
							}
						case 'MULTIPLE_SELECT':
							return {
								questionId: question.questionId,
								questionType: 'MULTIPLE_SELECT',
								answer: []
							}
						case 'TRUE_OR_FALSE':
							return {
								questionId: question.questionId,
								questionType: 'TRUE_OR_FALSE',
								answer: undefined
							}
					}
				})
			)
		}
	})

	const onSubmit = async (data: SubmitAssessmentAnswers) => {
		await handleSubmitAssessment(data)
	}

	let questionIndex = 0

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				{shuffledAssessments.map((assessment) => (
					<AssessmentCard key={assessment.assessmentId}>
						<AssessmentCardHeader
							title={assessment.title}
							instruction={assessment.instruction ?? ''}
							shuffleQuestions={assessment.shuffleQuestions}
							shuffleOptions={assessment.shuffleOptions}
						/>
						<AssessmentCardContent className="space-y-3">
							{assessment.questions.map((question) => {
								const currentIndex = questionIndex++
								return (
									<AssessmentQuestionCard
										key={question.questionId}
										question={question}
										index={currentIndex}
										form={form}
										isSubmitting={isSubmitting}
									/>
								)
							})}
						</AssessmentCardContent>
					</AssessmentCard>
				))}
				<div className="flex justify-end">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Submitting Assessment...' : 'Submit Assessment'}
					</Button>
				</div>
			</form>
		</Form>
	)
}
