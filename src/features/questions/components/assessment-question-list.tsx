'use client'

import * as React from 'react'
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd'
import { type Question } from '@prisma/client'

import { AssessmentQuestionHeader } from '@/features/questions/components/assessment-question-header'
import { EditAssessmentQuestionForm } from '@/features/questions/components/forms/edit-assessment-question-form'
import { MultipleChoiceQuestion } from '@/features/questions/components/question-type/multiple-choice-question'
import { MultipleSelectQuestion } from '@/features/questions/components/question-type/multiple-select-question'
import { TrueFalseQuestion } from '@/features/questions/components/question-type/true-false-question'
import { TiptapEditor } from '@/features/questions/components/tiptap-editor/editor'
import { type QuestionOptions } from '@/features/questions/lib/types'

type QuestionListProps = {
	items: Question[]
	onReorder: (updateData: { id: string; position: number }[]) => void
}

export const QuestionList = ({ items, onReorder }: QuestionListProps) => {
	const [assessments, setAssessments] = React.useState(items)
	const [editingQuestion, setEditingQuestion] = React.useState<Question | null>(null)

	React.useEffect(() => {
		setAssessments(items)
	}, [items])

	const handleDragEnd = ({ destination, source }: DropResult) => {
		if (!destination || source.index === destination.index) return

		const updatedAssessments = Array.from(assessments)
		const [movedAssessment] = updatedAssessments.splice(source.index, 1)
		updatedAssessments.splice(destination.index, 0, movedAssessment!)

		setAssessments(updatedAssessments)
		onReorder(
			updatedAssessments.map((assessment, index) => ({ id: assessment.id, position: index }))
		)
	}

	const renderQuestionContent = (assessment: Question) => {
		const options = assessment.options as QuestionOptions

		switch (assessment.type) {
			case 'MULTIPLE_CHOICE':
				return (
					<MultipleChoiceQuestion options={options.options} answer={options.answer as string} />
				)
			case 'MULTIPLE_SELECT':
				return (
					<MultipleSelectQuestion options={options.options} answer={options.answer as string[]} />
				)
			case 'TRUE_OR_FALSE':
				return <TrueFalseQuestion answer={options.answer as 'True' | 'False'} />
			default:
				return null
		}
	}

	return (
		<>
			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId="assessments">
					{(provided) => (
						<ol ref={provided.innerRef} className="space-y-2" {...provided.droppableProps}>
							{assessments.map((assessment, index) => (
								<Draggable key={assessment.id} draggableId={assessment.id} index={index}>
									{(provided) => (
										<li
											ref={provided.innerRef}
											className="rounded-xl border border-input bg-card dark:bg-background"
											{...provided.draggableProps}
										>
											<AssessmentQuestionHeader
												index={index}
												points={assessment.points}
												onEdit={() => setEditingQuestion(assessment)}
												onDelete={() => {
													/* TODO: Implement delete */
												}}
												dragHandleProps={provided.dragHandleProps}
											/>

											<div className="space-y-1 pb-4 pl-12 pr-4 text-base">
												<TiptapEditor
													content={assessment.question}
													editable={false}
													injectCSS={true}
													immediatelyRender={false}
												/>

												<div className="flex items-center gap-2 pl-2">
													<div className="flex-1 border-l-2 border-muted pl-3">
														{renderQuestionContent(assessment)}
													</div>
												</div>
											</div>
										</li>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</ol>
					)}
				</Droppable>
			</DragDropContext>

			{editingQuestion && (
				<EditAssessmentQuestionForm
					isOpen={!!editingQuestion}
					onClose={() => setEditingQuestion(null)}
					questionData={{
						id: editingQuestion.id,
						assessmentId: editingQuestion.assessmentId,
						question: editingQuestion.question,
						type: editingQuestion.type,
						options: (editingQuestion.options as QuestionOptions) ?? {
							type: 'MULTIPLE_CHOICE',
							options: [],
							answer: ''
						},
						points: editingQuestion.points
					}}
					assessmentId={editingQuestion.assessmentId}
				/>
			)}
		</>
	)
}
