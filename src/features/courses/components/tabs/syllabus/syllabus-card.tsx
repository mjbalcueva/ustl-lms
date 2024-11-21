'use client'

import { type Chapter } from '@prisma/client'

import { Button } from '@/core/components/ui/button'
import { Card, CardTitle } from '@/core/components/ui/card'
import { capitalize } from '@/core/lib/utils/capitalize'
import { cn } from '@/core/lib/utils/cn'

import { TiptapEditor } from '@/features/courses/components/tiptap-editor/editor'

type SyllabusCardProps = {
	chapters: Chapter[]
}

export default function SyllabusCard({ chapters }: SyllabusCardProps) {
	const chapterTypeIcons = {
		LESSON: { hoverColor: 'hover:text-blue-500' },
		ASSIGNMENT: { hoverColor: 'hover:text-green-500' },
		ASSESSMENT: { hoverColor: 'hover:text-orange-500' }
	} as const

	return (
		<div className="w-full space-y-2.5">
			{chapters.map((chapter) => {
				const { hoverColor } = chapterTypeIcons[chapter.type as keyof typeof chapterTypeIcons]
				return (
					<Card key={chapter.id} className="flex gap-4 px-4 pb-3 pt-4">
						<span className="text-xl text-muted-foreground">{chapter.position}</span>

						<div className="flex-1">
							<div className="flex-1 space-y-1">
								<CardTitle className="text-base font-semibold">{chapter.title}</CardTitle>
								<div className="line-clamp-2 text-sm leading-tight">
									<TiptapEditor value={chapter.content} />
								</div>
							</div>

							<div className="mt-1 flex flex-wrap items-center gap-1.5">
								<span className={cn('text-xs font-normal text-muted-foreground', hoverColor)}>
									#{capitalize(chapter.type)}
								</span>

								{/* {chapter.chapterProgress && (
									<span className="text-xs text-muted-foreground">
										{chapter.chapterProgress.isCompleted ? '#Completed' : '#Ongoing'}
									</span>
								)} */}
							</div>
						</div>

						<Button size="sm" className="px-4">
							View
						</Button>
					</Card>
				)
			})}
		</div>
	)
}
