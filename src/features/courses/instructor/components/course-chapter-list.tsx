'use client'

import Link from 'next/link'
import * as React from 'react'
import {
	DragDropContext,
	Draggable,
	Droppable,
	type DropResult
} from '@hello-pangea/dnd'
import { type Chapter } from '@prisma/client'

import { RouterOutputs } from '@/services/trpc/react'

import { Badge } from '@/core/components/ui/badge'
import { Separator } from '@/core/components/ui/separator'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/core/components/ui/tooltip'
import {
	Assessment,
	Assignment,
	Edit,
	GripVertical,
	Lesson
} from '@/core/lib/icons'
import { capitalize } from '@/core/lib/utils/capitalize'
import { cn } from '@/core/lib/utils/cn'

type ChapterListProps = {
	chapters: Chapter[]
	onReorder: (updateData: { id: string; position: number }[]) => void
}

export const ChapterList = ({
	chapters,
	onReorder
}: {
	chapters: RouterOutputs['instructor']['course']['findOneCourse']['course']['chapters']
	onReorder: (updateData: { id: string; position: number }[]) => void
}) => {
	const [chapterList, setChaptersList] = React.useState(chapters)

	React.useEffect(() => {
		setChaptersList(chapters)
	}, [chapters])

	const handleDragEnd = ({ destination, source }: DropResult) => {
		if (!destination || source.index === destination.index) return

		const updatedChapters = Array.from(chapterList)
		const [movedChapter] = updatedChapters.splice(source.index, 1)
		updatedChapters.splice(destination.index, 0, movedChapter!)

		setChaptersList(updatedChapters)
		onReorder(
			updatedChapters.map((chapter, index) => ({
				id: chapter.chapterId,
				position: index
			}))
		)
	}

	const chapterTypeIcons = {
		LESSON: { Icon: Lesson, color: 'text-blue-500' },
		ASSIGNMENT: { Icon: Assignment, color: 'text-green-500' },
		ASSESSMENT: { Icon: Assessment, color: 'text-orange-500' }
	} as const

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Droppable droppableId="chapters">
				{(provided) => (
					<ol
						ref={provided.innerRef}
						className="space-y-2"
						{...provided.droppableProps}
					>
						{chapterList.map((chapter, index) => {
							const isPublished = chapter.status === 'PUBLISHED'
							const isArchived = chapter.status === 'ARCHIVED'
							const { Icon, color } =
								chapterTypeIcons[chapter.type as keyof typeof chapterTypeIcons]

							return (
								<Draggable
									key={chapter.chapterId}
									draggableId={chapter.chapterId}
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

											<Tooltip>
												<TooltipTrigger className="cursor-default">
													<Icon
														className={cn('size-5 dark:text-opacity-75', color)}
													/>
												</TooltipTrigger>
												<TooltipContent>
													{capitalize(chapter.type)}
												</TooltipContent>
											</Tooltip>

											{chapter.title}

											<Badge
												variant={
													isPublished
														? 'default'
														: isArchived
															? 'outline'
															: 'secondary'
												}
												className="ml-auto select-none"
											>
												{isPublished
													? 'Published'
													: isArchived
														? 'Archived'
														: 'Draft'}
											</Badge>

											<Tooltip>
												<TooltipTrigger asChild>
													<Link
														className="flex h-full items-center justify-center rounded-r-xl pl-1 pr-2 outline-none hover:opacity-75 focus-visible:outline-ring"
														href={`/instructor/courses/${chapter.courseId}/${chapter.type.toLocaleLowerCase()}/${chapter.chapterId}`}
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
