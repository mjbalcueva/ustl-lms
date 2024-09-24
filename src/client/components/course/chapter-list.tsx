'use client'

import Link from 'next/link'
import * as React from 'react'
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd'
import { type Chapter } from '@prisma/client'
import { TbEdit, TbGripVertical } from 'react-icons/tb'

import { Badge } from '@/client/components/ui'

type ChapterListProps = {
	items: Chapter[]
	onReorder: (updateData: { id: string; position: number }[]) => void
}

export const ChapterList = ({ items, onReorder }: ChapterListProps) => {
	const [chapters, setChapters] = React.useState(items)

	React.useEffect(() => {
		setChapters(items)
	}, [items])

	const handleDragEnd = ({ destination, source }: DropResult) => {
		if (!destination || source.index === destination.index) return

		const updatedChapters = Array.from(chapters)
		const [movedChapter] = updatedChapters.splice(source.index, 1)
		updatedChapters.splice(destination.index, 0, movedChapter!)

		setChapters(updatedChapters)
		onReorder(updatedChapters.map((chapter, index) => ({ id: chapter.id, position: index })))
	}

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Droppable droppableId="chapters">
				{(provided) => (
					<ol ref={provided.innerRef} className="space-y-2" {...provided.droppableProps}>
						{chapters.map((chapter, index) => (
							<Draggable key={chapter.id} draggableId={chapter.id} index={index}>
								{(provided) => (
									<li
										ref={provided.innerRef}
										className="flex h-10 items-center gap-2 rounded-xl border border-input bg-card dark:bg-background"
										{...provided.draggableProps}
									>
										<div
											className="flex h-full items-center rounded-l-xl pl-2 pr-1 text-muted-foreground outline-none hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-ring"
											{...provided.dragHandleProps}
										>
											<TbGripVertical className="size-4" />
										</div>

										{chapter.title}

										<Badge variant={chapter.isPublished ? 'default' : 'secondary'} className="ml-auto select-none">
											{chapter.isPublished ? 'Published' : 'Draft'}
										</Badge>

										<Link
											className="flex h-full items-center justify-center rounded-r-xl pl-1 pr-2 outline-none hover:opacity-75 focus-visible:outline-ring"
											href={`/courses/${chapter.courseId}/${chapter.id}/edit`}
										>
											<TbEdit className="size-4" />
										</Link>
									</li>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</ol>
				)}
			</Droppable>
		</DragDropContext>
	)
}
