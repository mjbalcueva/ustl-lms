'use client'

import Link from 'next/link'
import * as React from 'react'
import {
	DragDropContext,
	Draggable,
	Droppable,
	type DropResult
} from '@hello-pangea/dnd'

import { type RouterOutputs } from '@/services/trpc/react'

import { Separator } from '@/core/components/ui/separator'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/core/components/ui/tooltip'
import { Edit, GripVertical } from '@/core/lib/icons'

export const AssessmentList = ({
	courseId,
	chapterId,
	items,
	onReorder
}: {
	courseId: RouterOutputs['instructor']['course']['findOneCourse']['course']['courseId']
	chapterId: RouterOutputs['instructor']['chapter']['findOneChapter']['chapter']['chapterId']
	items: RouterOutputs['instructor']['chapter']['findOneChapter']['chapter']['assessments']
	onReorder: (updateData: { assessmentId: string; position: number }[]) => void
}) => {
	const [assessments, setAssessments] = React.useState(items)

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
			updatedAssessments.map((assessment, index) => ({
				assessmentId: assessment.assessmentId,
				position: index
			}))
		)
	}

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Droppable droppableId="assessments">
				{(provided) => (
					<ol
						ref={provided.innerRef}
						className="space-y-2"
						{...provided.droppableProps}
					>
						{assessments.map((assessment, index) => {
							return (
								<Draggable
									key={assessment.assessmentId}
									draggableId={assessment.assessmentId}
									index={index}
								>
									{(provided) => (
										<li
											ref={provided.innerRef}
											className="flex h-10 items-center gap-2 rounded-xl border border-input bg-card dark:bg-background"
											{...provided.draggableProps}
										>
											<div
												className="flex h-full items-center justify-between rounded-l-xl pl-2 text-muted-foreground outline-none hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-ring"
												{...provided.dragHandleProps}
											>
												<GripVertical className="size-4" />
												<Separator orientation="vertical" className="ml-1" />
											</div>

											{assessment.title}

											<Tooltip>
												<TooltipTrigger asChild>
													<Link
														className="ml-auto flex h-full items-center justify-center rounded-r-xl pl-1 pr-2 outline-none hover:opacity-75 focus-visible:outline-ring"
														href={`/instructor/courses/${courseId}/assessment/${chapterId}/questions/${assessment.assessmentId}`}
													>
														<Edit className="size-4" />
													</Link>
												</TooltipTrigger>
												<TooltipContent>Edit</TooltipContent>
											</Tooltip>
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
	)
}
