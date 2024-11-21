'use client'

import Link from 'next/link'
import { type Chapter, type ChapterProgress } from '@prisma/client'

import { buttonVariants } from '@/core/components/ui/button'
import { Card, CardTitle } from '@/core/components/ui/card'
import { capitalize } from '@/core/lib/utils/capitalize'
import { cn } from '@/core/lib/utils/cn'

import { TiptapEditor } from '@/features/courses/components/tiptap-editor/editor'

type SyllabusCardProps = {
	chapters: (Chapter & {
		chapterProgress: ChapterProgress | null
	})[]
}

export default function SyllabusCard({ chapters }: SyllabusCardProps) {
	const chapterTypeIcons = {
		LESSON: { hoverColor: 'hover:text-blue-500' },
		ASSIGNMENT: { hoverColor: 'hover:text-green-500' },
		ASSESSMENT: { hoverColor: 'hover:text-orange-500' }
	} as const

	return (
		<>
			{chapters.map((chapter) => {
				const { hoverColor } = chapterTypeIcons[chapter.type as keyof typeof chapterTypeIcons]
				const isCompleted = chapter.chapterProgress?.isCompleted

				return (
					<Card key={chapter.id} className="flex gap-4 px-4 pb-3 pt-4">
						<span className="text-xl text-muted-foreground">{chapter.position}</span>

						<div className="flex-1">
							<div className="flex-1 space-y-1">
								<CardTitle className="text-base font-semibold">{chapter.title}</CardTitle>
								<div className="line-clamp-1 text-sm leading-tight lg:line-clamp-2">
									<TiptapEditor value={chapter.content} />
								</div>
							</div>

							<div className="mt-1 flex flex-wrap items-center gap-1.5">
								<span className={cn('text-xs font-normal text-muted-foreground', hoverColor)}>
									#{capitalize(chapter.type)}
								</span>

								{chapter.chapterProgress && (
									<span className="text-xs text-muted-foreground">
										{isCompleted ? '#Completed' : '#Ongoing'}
									</span>
								)}
							</div>
						</div>

						<Link
							className={cn(
								buttonVariants({ size: 'sm', variant: isCompleted ? 'outline' : 'default' }),
								'px-4'
							)}
							href={`/courses/${chapter.courseId}/chapters/${chapter.id}`}
						>
							{isCompleted ? 'Review' : 'Start'}
						</Link>
					</Card>
				)
			})}
		</>
	)
}
