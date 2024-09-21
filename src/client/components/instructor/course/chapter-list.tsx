'use client'

import * as React from 'react'
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd'
import { type Chapter } from '@prisma/client'
import { LuGripVertical, LuPencil } from 'react-icons/lu'
import { useIsMounted } from 'usehooks-ts'

import { Badge } from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

type ChapterListProps = {
	items: Chapter[]
	onEdit: (id: string) => void
	onReorder: (updateData: { id: string; position: number }[]) => void
}

export const ChapterList = ({ items, onEdit, onReorder }: ChapterListProps) => {
	const [chapters, setChapters] = React.useState(items)
	const isMounted = useIsMounted()

	React.useEffect(() => {
		setChapters(items)
	}, [items])

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination) return

		const items = Array.from(chapters)
		const [reorderedItem] = items.splice(result.source.index, 1)
		items.splice(result.destination.index, 0, reorderedItem!)

		const startIndex = Math.min(result.source.index, result.destination.index)
		const endIndex = Math.max(result.source.index, result.destination.index)

		const updatedChapters = items.slice(startIndex, endIndex + 1)

		setChapters(items)

		const bulkUpdateData = updatedChapters.map((chapter) => ({
			id: chapter.id,
			position: items.findIndex((item) => item.id === chapter.id)
		}))

		onReorder(bulkUpdateData)
	}

	if (!isMounted) return null

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Droppable droppableId="chapters">
				{(provided) => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{chapters.map((chapter, index) => (
							<Draggable key={chapter.id} draggableId={chapter.id} index={index}>
								{(provided) => (
									<div
										ref={provided.innerRef}
										className={cn('item-center mb-2 flex rounded-xl border border-input bg-background')}
										{...provided.draggableProps}
									>
										<div
											className={cn(
												'flex h-10 items-center rounded-l-xl border-r border-input px-1 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
											)}
											{...provided.dragHandleProps}
										>
											<LuGripVertical className="size-5" />
										</div>
										<span className="flex flex-1 items-center px-2">{chapter.title}</span>
										<div className="flex items-center gap-x-1.5 pr-1">
											<Badge variant={chapter.isPublished ? 'default' : 'secondary'} className="select-none">
												{chapter.isPublished ? 'Published' : 'Draft'}
											</Badge>
											<button className="rounded-lg p-2 hover:opacity-75" onClick={() => onEdit(chapter.id)}>
												<LuPencil className="size-4" />
											</button>
										</div>
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	)
}
