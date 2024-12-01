'use client'

import Link from 'next/link'
import { type inferProcedureOutput } from '@trpc/server'

import { type AppRouter } from '@/server/api/root'

import { IconBadge } from '@/core/components/icon-badge'
import { buttonVariants } from '@/core/components/ui/button'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/core/components/ui/tooltip'
import { Assessment, Assignment, Lesson } from '@/core/lib/icons'
import { capitalize } from '@/core/lib/utils/capitalize'
import { cn } from '@/core/lib/utils/cn'
import { formatDate } from '@/core/lib/utils/format-date'

export const ChapterCard = ({
	chapter
}: {
	chapter: NonNullable<
		inferProcedureOutput<
			AppRouter['student']['course']['findEnrolledCourse']
		>['course']['chapters']
	>[number]
}) => {
	const chapterTypeIcons = {
		LESSON: { icon: Lesson },
		ASSIGNMENT: { icon: Assignment },
		ASSESSMENT: { icon: Assessment }
	} as const

	const chapterDetails = {
		chapterId: chapter.chapterId,
		courseId: chapter.courseId,
		type: chapter.type ?? 'LESSON',
		title: chapter.title,
		createdAt: chapter.createdAt ?? '',
		isCompleted: chapter.chapterProgress?.[0]?.isCompleted
	}

	return (
		<Card key={chapterDetails.chapterId}>
			<CardHeader className="flex-row items-center gap-4 space-y-0 p-4">
				<Tooltip>
					<TooltipTrigger className="rounded-full ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
						<IconBadge
							icon={chapterTypeIcons[chapterDetails.type].icon}
							size="lg"
						/>
					</TooltipTrigger>
					<TooltipContent>{capitalize(chapterDetails.type)}</TooltipContent>
				</Tooltip>

				<div className="flex-1">
					<CardTitle className="text-base font-semibold">
						{chapterDetails.title}
					</CardTitle>
					<CardDescription className="flex items-center gap-2">
						{formatDate(chapterDetails.createdAt)}
					</CardDescription>
				</div>

				<Link
					className={cn(
						buttonVariants({
							size: 'sm',
							variant: chapterDetails.isCompleted ? 'outline' : 'default'
						}),
						'px-4'
					)}
					href={`/courses/${chapterDetails.courseId}/${chapterDetails.type.toLowerCase()}/${chapterDetails.chapterId}`}
				>
					{chapterDetails.isCompleted ? 'Review' : 'Start'}
				</Link>
			</CardHeader>
		</Card>
	)
}
