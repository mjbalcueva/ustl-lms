'use client'

import Link from 'next/link'

import { type RouterOutputs } from '@/services/trpc/react'

import { Card, CardHeader, CardTitle } from '@/core/components/ui/card'
import { ScrollArea, ScrollBar } from '@/core/components/ui/scroll-area'
import { Separator } from '@/core/components/ui/separator'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/core/components/ui/tooltip'
import { Assessment, Assignment, Check, Lesson } from '@/core/lib/icons'
import { capitalize } from '@/core/lib/utils/capitalize'
import { cn } from '@/core/lib/utils/cn'
import { formatDate } from '@/core/lib/utils/format-date'

type ChapterProgressProps = {
	chapters: NonNullable<
		RouterOutputs['student']['chapter']['findOneChapter']['chapter']
	>
}

export const ChapterProgress = ({ chapters }: ChapterProgressProps) => {
	return (
		<Card>
			<CardHeader className="py-2">
				<CardTitle className="text-lg">Course Progress</CardTitle>
			</CardHeader>

			<Separator />

			<ScrollArea className="h-56 p-2 pr-2.5">
				{chapters.course.chapters.map((chapter) => {
					if (!chapter) return null

					const isCompleted = chapter.chapterProgress?.[0]?.isCompleted ?? false
					const isCurrent = chapter.chapterId === chapters.chapterId
					const status = isCompleted
						? isCurrent
							? 'current-completed'
							: 'completed'
						: isCurrent
							? 'current'
							: 'not-completed'

					const iconMap = {
						ASSESSMENT: <Assessment className="size-4" />,
						ASSIGNMENT: <Assignment className="size-4" />,
						LESSON: <Lesson className="size-4" />
					}

					const Icon = iconMap[chapter.type]

					return (
						<Link
							key={chapter.chapterId}
							href={`/courses/${chapters.course.courseId}/${chapter.type.toLowerCase()}/${chapter.chapterId}`}
							className="flex items-center gap-3 rounded-lg p-4 py-2 hover:bg-muted/50"
							tabIndex={-1}
						>
							<Tooltip>
								<TooltipTrigger
									className={cn(
										'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
										status === 'current-completed' &&
											'bg-primary text-primary-foreground',
										status === 'completed' &&
											'bg-secondary text-secondary-foreground',
										status === 'current' &&
											'bg-primary text-primary-foreground',
										status === 'not-completed' &&
											'bg-muted text-muted-foreground'
									)}
								>
									{status === 'completed' || status === 'current-completed' ? (
										<Check className="h-4 w-4" />
									) : (
										Icon
									)}
								</TooltipTrigger>
								<TooltipContent>{capitalize(chapter.type)}</TooltipContent>
							</Tooltip>

							<div>
								<h3
									className={cn(
										'line-clamp-1 text-sm font-medium leading-none',
										status === 'current' && 'font-semibold text-primary',
										status === 'current-completed' &&
											'font-semibold text-primary'
									)}
								>
									{chapter.title}
								</h3>
								<p className="text-xs text-muted-foreground">
									{formatDate(chapter.createdAt, { month: 'short' })}
								</p>
							</div>
						</Link>
					)
				})}
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</Card>
	)
}
