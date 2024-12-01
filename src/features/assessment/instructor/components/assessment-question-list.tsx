'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import {
	DragDropContext,
	Draggable,
	Droppable,
	type DropResult
} from '@hello-pangea/dnd'
import { toast } from 'sonner'

import { api, type RouterOutputs } from '@/services/trpc/react'

import { ContentViewer } from '@/core/components/tiptap-editor/content-viewer'
import { Badge } from '@/core/components/ui/badge'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/core/components/ui/tooltip'
import { Delete, Edit, GripVertical } from '@/core/lib/icons'

import { EditAssessmentQuestionForm } from '@/features/assessment/instructor/components/forms/edit-assessment-question-form'
import { DisplayQuestion } from '@/features/assessment/instructor/components/question/display-question'

export const QuestionList = ({
	questionList,
	onReorder
}: {
	questionList: RouterOutputs['instructor']['assessment']['findOneAssessment']['assessment']['questions']
	onReorder: (updateData: { questionId: string; position: number }[]) => void
}) => {
	const router = useRouter()

	const [questions, setQuestions] = React.useState(questionList)
	const [editingQuestion, setEditingQuestion] = React.useState<
		| RouterOutputs['instructor']['assessment']['findOneAssessment']['assessment']['questions'][number]
		| null
	>(null)

	React.useEffect(() => {
		setQuestions(questionList)
	}, [questionList])

	const handleDragEnd = ({ destination, source }: DropResult) => {
		if (!destination || source.index === destination.index) return

		const updatedQuestions = Array.from(questions)
		const [movedQuestion] = updatedQuestions.splice(source.index, 1)
		updatedQuestions.splice(destination.index, 0, movedQuestion!)

		setQuestions(updatedQuestions)
		onReorder(
			updatedQuestions.map((question, index) => ({
				questionId: question.questionId,
				position: index
			}))
		)
	}

	const { mutate: deleteQuestion } =
		api.instructor.assessmentQuestion.deleteQuestion.useMutation({
			onSuccess: (data) => {
				toast.success(data.message)
				router.refresh()
			}
		})

	return (
		<>
			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId="assessments">
					{(provided) => (
						<ol
							ref={provided.innerRef}
							className="space-y-2"
							{...provided.droppableProps}
						>
							{questions.map((question, index) => {
								return (
									<Draggable
										key={question.questionId}
										draggableId={question.questionId}
										index={index}
									>
										{(provided) => (
											<li
												ref={provided.innerRef}
												className="rounded-xl border border-input bg-card dark:bg-background"
												{...provided.draggableProps}
											>
												<div className="flex items-center gap-2 px-2.5 pb-2.5 pt-3">
													<span
														className="rounded-md p-1.5 outline-none hover:bg-accent focus-visible:outline-ring"
														{...provided.dragHandleProps}
													>
														<GripVertical className="size-4 shrink-0" />
													</span>

													<div className="flex flex-1 items-center gap-2">
														<Badge
															variant="secondary"
															className="text-sm font-medium leading-4"
														>
															Question #{index + 1}
														</Badge>
														<span className="text-sm text-muted-foreground">
															({question.points}{' '}
															{question.points === 1 ? 'point' : 'points'})
														</span>
													</div>

													<Tooltip>
														<TooltipTrigger
															className="rounded-md p-1.5 outline-none hover:bg-accent focus-visible:outline-ring"
															onClick={() => setEditingQuestion(question)}
														>
															<Edit className="size-4" />
														</TooltipTrigger>
														<TooltipContent>Edit</TooltipContent>
													</Tooltip>

													<Tooltip>
														<TooltipTrigger
															className="rounded-md p-1.5 outline-none hover:bg-accent focus-visible:outline-ring"
															onClick={() =>
																deleteQuestion({
																	questionId: question.questionId
																})
															}
														>
															<Delete className="size-4" />
														</TooltipTrigger>
														<TooltipContent>Delete</TooltipContent>
													</Tooltip>
												</div>

												<div className="space-y-1 pb-4 pl-12 pr-4">
													<ContentViewer content={question.question} />
													<DisplayQuestion question={question} />
												</div>
											</li>
										)}
									</Draggable>
								)
							})}
							{provided.placeholder}
						</ol>
					)}
				</Droppable>
			</DragDropContext>

			{editingQuestion && (
				<EditAssessmentQuestionForm
					isOpen={!!editingQuestion}
					onClose={() => setEditingQuestion(null)}
					question={editingQuestion}
				/>
			)}
		</>
	)
}
