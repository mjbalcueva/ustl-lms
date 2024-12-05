'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { type AssessmentQuestionType } from '@prisma/client'
import { toast } from 'sonner'

import { api, type RouterOutputs } from '@/services/trpc/react'

import { Button } from '@/core/components/ui/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import { Checkbox } from '@/core/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/core/components/ui/radio-group'
import { Flag } from '@/core/lib/icons'

import { questionTypeWordMap } from '@/features/assessment/shared/libs/question-type-word-map'

interface FlaggedQuestion {
	questionId: string
}

type Assessment = NonNullable<
	RouterOutputs['student']['chapter']['findOneChapter']['chapter']
>['assessments'][0]

type Question = Assessment['questions'][0]

export const AssessmentForm = ({
	assessments
}: {
	assessments: Assessment[]
}) => {
	const router = useRouter()
	const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
	const [flaggedQuestions, setFlaggedQuestions] = useState<FlaggedQuestion[]>(
		[]
	)

	const { mutate: submitAssessment, isPending } =
		api.student.assessment.submit.useMutation({
			onSuccess: () => {
				toast.success('Assessment submitted successfully')
				router.refresh()
			},
			onError: (error) => {
				toast.error(error.message)
			}
		})

	const toggleFlag = (questionId: string) => {
		setFlaggedQuestions((prev) => {
			const isCurrentlyFlagged = prev.some((q) => q.questionId === questionId)

			if (isCurrentlyFlagged) {
				return prev.filter((q) => q.questionId !== questionId)
			} else {
				return [...prev, { questionId }]
			}
		})
	}

	const isQuestionFlagged = (questionId: string) => {
		return flaggedQuestions.some((q) => q.questionId === questionId)
	}

	const handleAnswerChange = (questionId: string, value: string | string[]) => {
		setAnswers((prev) => ({
			...prev,
			[questionId]: value
		}))
	}

	const handleSubmit = (assessmentId: string) => {
		const assessmentQuestions =
			assessments
				.find((a) => a.assessmentId === assessmentId)
				?.questions.map((q) => q.questionId) ?? []

		const formattedAnswers = Object.entries(answers)
			.filter(([questionId]) => assessmentQuestions.includes(questionId))
			.map(([questionId, answer]) => ({
				questionId,
				answer
			}))

		submitAssessment({
			assessmentId,
			answers: formattedAnswers
		})
	}

	const renderQuestion = (question: Question) => {
		const options = question.options as {
			type: AssessmentQuestionType
			options: string[]
		}

		return (
			<Card key={question.questionId}>
				<CardContent className="relative p-6">
					<Button
						variant="ghost"
						size="icon"
						className="absolute right-4 top-4"
						onClick={() => toggleFlag(question.questionId)}
					>
						<Flag
							className={`h-4 w-4 ${
								isQuestionFlagged(question.questionId)
									? 'fill-yellow-500 text-yellow-500'
									: 'text-muted-foreground'
							}`}
						/>
					</Button>

					<div className="mb-4 flex gap-4">
						<span className="text-sm text-muted-foreground">
							({question.points} {question.points === 1 ? 'point' : 'points'})
						</span>
						<span className="text-sm text-muted-foreground">
							{questionTypeWordMap[question.questionType]}
						</span>
					</div>

					<div className="mb-6">
						<p className="text-base">{question.question}</p>
					</div>

					{question.questionType === 'MULTIPLE_CHOICE' && (
						<RadioGroup
							value={answers[question.questionId] as string}
							onValueChange={(value) =>
								handleAnswerChange(question.questionId, value)
							}
							className="gap-3"
						>
							{options.options.map((option, i) => (
								<div key={i} className="flex items-center space-x-2">
									<RadioGroupItem
										value={option}
										id={`q${question.questionId}-${i}`}
									/>
									<label
										htmlFor={`q${question.questionId}-${i}`}
										className="text-sm font-normal"
									>
										{option}
									</label>
								</div>
							))}
						</RadioGroup>
					)}

					{question.questionType === 'MULTIPLE_SELECT' && (
						<div className="space-y-3">
							{options.options.map((option, i) => (
								<div key={i} className="flex items-center space-x-2">
									<Checkbox
										id={`q${question.questionId}-${i}`}
										checked={(
											answers[question.questionId] as string[]
										)?.includes(option)}
										onCheckedChange={(checked) => {
											const currentAnswers =
												(answers[question.questionId] as string[]) || []
											if (checked) {
												handleAnswerChange(question.questionId, [
													...currentAnswers,
													option
												])
											} else {
												handleAnswerChange(
													question.questionId,
													currentAnswers.filter((a) => a !== option)
												)
											}
										}}
									/>
									<label
										htmlFor={`q${question.questionId}-${i}`}
										className="text-sm font-normal"
									>
										{option}
									</label>
								</div>
							))}
						</div>
					)}

					{question.questionType === 'TRUE_OR_FALSE' && (
						<RadioGroup
							value={answers[question.questionId] as string}
							onValueChange={(value) =>
								handleAnswerChange(question.questionId, value)
							}
							className="gap-3"
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="True"
									id={`q${question.questionId}-true`}
								/>
								<label
									htmlFor={`q${question.questionId}-true`}
									className="text-sm font-normal"
								>
									True
								</label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="False"
									id={`q${question.questionId}-false`}
								/>
								<label
									htmlFor={`q${question.questionId}-false`}
									className="text-sm font-normal"
								>
									False
								</label>
							</div>
						</RadioGroup>
					)}
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="space-y-8">
			{assessments.map((assessment) => (
				<div key={assessment.assessmentId} className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>{assessment.title}</CardTitle>
							{assessment.instruction && <p>{assessment.instruction}</p>}
						</CardHeader>
					</Card>

					<div className="space-y-4">
						{assessment.questions.map((question) => renderQuestion(question))}
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Flag className="h-4 w-4 text-yellow-500" />
							<p className="text-sm text-muted-foreground">
								Click the flag icon to mark questions for review
							</p>
						</div>
						<Button
							onClick={() => handleSubmit(assessment.assessmentId)}
							disabled={isPending}
							size="lg"
						>
							Submit Assessment
						</Button>
					</div>
				</div>
			))}
		</div>
	)
}
