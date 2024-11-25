'use client'

import Link from 'next/link'

import { Card } from '@/core/components/ui/card'
import { ScrollArea } from '@/core/components/ui/scroll-area'
import { Check } from '@/core/lib/icons'

import { type ChapterWithDetails } from '../types'

interface ChapterProgressProps {
	chapters: ChapterWithDetails[]
	currentChapterId: string
	completedChapterIds: string[]
}

export const ChapterProgress = ({
	chapters,
	currentChapterId,
	completedChapterIds
}: ChapterProgressProps) => {
	return (
		<Card>
			<div className="border-b p-4">
				<h2 className="font-semibold">Course Progress</h2>
			</div>
			<ScrollArea className="h-[300px]">
				<div className="divide-y">
					{chapters.map((chapter) => {
						const isCompleted = completedChapterIds.includes(chapter.id)
						const isCurrent = chapter.id === currentChapterId
						let status: 'completed' | 'current' | 'not-completed' = 'not-completed'

						if (isCompleted) {
							status = 'completed'
						} else if (isCurrent) {
							status = 'current'
						}

						return (
							<div key={chapter.id} className="p-4 hover:bg-muted/50">
								<Link
									href={`/courses/${chapter.courseId}/lesson/${chapter.id}`}
									className="flex items-center gap-4"
								>
									<div
										className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
											status === 'completed'
												? 'bg-green-500 text-white'
												: status === 'current'
													? 'bg-blue-500 text-white'
													: 'bg-muted text-muted-foreground'
										}`}
									>
										{status === 'completed' ? (
											<Check className="h-4 w-4" />
										) : (
											<span className="text-sm">{chapter.position}</span>
										)}
									</div>
									<div className="flex-grow">
										<h3 className="font-medium leading-none">{chapter.title}</h3>
										<p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
											{chapter.description}
										</p>
									</div>
									{status === 'current' && (
										<div className="flex-shrink-0 text-blue-500">
											<span className="text-xs font-medium">Current</span>
										</div>
									)}
								</Link>
							</div>
						)
					})}
				</div>
			</ScrollArea>
		</Card>
	)
}
