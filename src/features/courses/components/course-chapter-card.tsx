'use client'

import Link from 'next/link'
import { type ChapterType } from '@prisma/client'

import { IconBadge } from '@/core/components/icon-badge'
import { buttonVariants } from '@/core/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/core/components/ui/tooltip'
import { Assessment, Assignment, Clock, Lesson } from '@/core/lib/icons'
import { capitalize } from '@/core/lib/utils/capitalize'
import { cn } from '@/core/lib/utils/cn'
import { formatDate } from '@/core/lib/utils/format-date'

type CourseChapterCardProps = {
	id: string
	courseId: string
	title: string
	content: string
	type: ChapterType
	createdAt: Date
	isCompleted: boolean
}

export default function CourseChapterCard({
	id,
	courseId,
	title,
	type,
	createdAt,
	isCompleted
}: CourseChapterCardProps) {
	const chapterTypeIcons = {
		LESSON: { icon: Lesson },
		ASSIGNMENT: { icon: Assignment },
		ASSESSMENT: { icon: Assessment }
	} as const

	return (
		<>
			<Card key={id}>
				<CardHeader className="flex-row items-center gap-4 space-y-0 p-4">
					<Tooltip>
						<TooltipTrigger>
							<IconBadge icon={chapterTypeIcons[type].icon} size="lg" />
						</TooltipTrigger>
						<TooltipContent>{capitalize(type)}</TooltipContent>
					</Tooltip>

					<div className="flex-1">
						<CardTitle className="text-base font-semibold">{title}</CardTitle>
						<CardDescription className="flex items-center gap-2">
							<span className="flex items-center gap-1">
								<Clock className="size-4" /> {formatDate(createdAt)}
							</span>
						</CardDescription>
					</div>

					<Link
						className={cn(
							buttonVariants({ size: 'sm', variant: isCompleted ? 'outline' : 'default' }),
							'px-4'
						)}
						href={`/courses/${courseId}/chapters/${id}`}
					>
						{isCompleted ? 'Review' : 'Start'}
					</Link>
				</CardHeader>
			</Card>
		</>
	)
}
