'use client'

import * as React from 'react'
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd'
import { type Question } from '@prisma/client'

import { Badge } from '@/core/components/ui/badge'
import { Checkbox } from '@/core/components/ui/checkbox'
import { Label } from '@/core/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/core/components/ui/radio-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/core/components/ui/tooltip'
import { Delete, Edit, GripVertical } from '@/core/lib/icons'

import { EditAssessmentQuestionForm } from '@/features/questions/components/forms/edit-assessment-question-form'
import { TiptapEditor } from '@/features/questions/components/tiptap-editor/editor'

type QuestionOptions =
	| {
			type: 'MULTIPLE_CHOICE'
			options: string[]
			answer: string
	  }
	| {
			type: 'MULTIPLE_SELECT'
			options: string[]
			answer: string[]
	  }
	| {
			type: 'TRUE_OR_FALSE'
			options: ['True', 'False']
			answer: 'True' | 'False'
	  }

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

	return (
		<>
			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId="assessments">
					{(provided) => (
						<ol ref={provided.innerRef} className="space-y-2" {...provided.droppableProps}>
							{assessments.map((assessment, index) => {
								return (
									<Draggable key={assessment.id} draggableId={assessment.id} index={index}>
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
														<Badge variant="secondary" className="text-sm font-medium leading-4">
															Question #{index + 1}
														</Badge>
														<span className="text-sm text-muted-foreground">
															({assessment.points} {assessment.points === 1 ? 'point' : 'points'})
														</span>
													</div>

													<Tooltip>
														<TooltipTrigger
															className="rounded-md p-1.5 outline-none hover:bg-accent focus-visible:outline-ring"
															onClick={() => setEditingQuestion(assessment)}
														>
															<Edit className="size-4" />
														</TooltipTrigger>
														<TooltipContent>Edit</TooltipContent>
													</Tooltip>
													<Tooltip>
														<TooltipTrigger className="rounded-md p-1.5 outline-none hover:bg-accent focus-visible:outline-ring">
															<Delete className="size-4" />
														</TooltipTrigger>
														<TooltipContent>Delete</TooltipContent>
													</Tooltip>
												</div>

												<div className="space-y-1 pb-4 pl-12 pr-4 text-base">
													<TiptapEditor
														content={assessment.question}
														editable={false}
														injectCSS={true}
														immediatelyRender={false}
													/>

													<div className="flex items-center gap-2 pl-2">
														<div className="flex-1 border-l-2 border-muted pl-3">
															{assessment.type === 'MULTIPLE_CHOICE' && (
																<div className="space-y-2">
																	{(assessment.options as QuestionOptions).options.map(
																		(option, i) => (
																			<div key={i} className="flex items-center gap-2">
																				<RadioGroup
																					value={
																						(assessment.options as QuestionOptions).answer as string
																					}
																				>
																					<RadioGroupItem
																						value={option}
																						disabled
																						className={
																							option ===
																							(assessment.options as QuestionOptions).answer
																								? 'border-green-500'
																								: ''
																						}
																					/>
																				</RadioGroup>
																				<span
																					className={`text-sm ${
																						option ===
																						(assessment.options as QuestionOptions).answer
																							? 'font-medium text-green-500'
																							: 'text-muted-foreground'
																					}`}
																				>
																					{option}
																				</span>
																			</div>
																		)
																	)}
																</div>
															)}

															{assessment.type === 'MULTIPLE_SELECT' && (
																<div className="space-y-2">
																	{(assessment.options as QuestionOptions).options.map(
																		(option, i) => {
																			const isCorrect = (
																				assessment.options as QuestionOptions
																			).answer.includes(option)
																			return (
																				<div key={i} className="flex items-center gap-2">
																					<Checkbox
																						disabled
																						checked={isCorrect}
																						className={isCorrect ? 'border-green-500' : ''}
																					/>
																					<span
																						className={`text-sm ${
																							isCorrect
																								? 'font-medium text-green-500'
																								: 'text-muted-foreground'
																						}`}
																					>
																						{option}
																					</span>
																				</div>
																			)
																		}
																	)}
																</div>
															)}

															{assessment.type === 'TRUE_OR_FALSE' && (
																<div className="space-y-2">
																	<RadioGroup
																		value={String(
																			(assessment.options as QuestionOptions).answer
																		).toLowerCase()}
																		disabled
																	>
																		{['true', 'false'].map((value) => (
																			<div key={value} className="flex items-center gap-2">
																				<RadioGroupItem
																					value={value}
																					className={
																						value ===
																						String(
																							(assessment.options as QuestionOptions).answer
																						).toLowerCase()
																							? 'border-green-500'
																							: ''
																					}
																				/>
																				<Label
																					className={`text-sm ${
																						value ===
																						String(
																							(assessment.options as QuestionOptions).answer
																						).toLowerCase()
																							? 'font-medium text-green-500'
																							: 'text-muted-foreground'
																					}`}
																				>
																					{value.charAt(0).toUpperCase() + value.slice(1)}
																				</Label>
																			</div>
																		))}
																	</RadioGroup>
																</div>
															)}
														</div>
													</div>
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
