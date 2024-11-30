'use client'

import Image from 'next/image'
import Link from 'next/link'

import { type RouterOutputs } from '@/services/trpc/react'

import { Badge } from '@/core/components/ui/badge'
import { Button } from '@/core/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader
} from '@/core/components/ui/card'
import { Learning } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'

export const EnrolledCourseCard = ({
	course: { courseId, title, description, imageUrl, code, instructor, tags }
}: {
	course: RouterOutputs['student']['course']['findManyEnrolledCourses']['courses'][number]
}) => {
	return (
		<Card className="flex w-full min-w-[270px] max-w-[285px] flex-1 flex-col overflow-hidden">
			<CardHeader className="relative p-0">
				<Image
					alt={title}
					className="h-32 w-full object-cover"
					src={imageUrl ?? '/assets/placeholder.svg'}
					height={256}
					width={256}
					priority
				/>
				<Badge className="absolute left-2 top-1 bg-background/80 text-foreground backdrop-blur-sm">
					{code}
				</Badge>
			</CardHeader>
			<CardContent className="grid flex-grow gap-3 p-3">
				<div className="space-y-1">
					<h3 className="line-clamp-1 text-base font-semibold">{title}</h3>
					<p
						className={cn(
							'line-clamp-3 min-h-12 text-sm leading-tight text-muted-foreground',
							description ? '' : 'italic'
						)}
					>
						{description ?? 'No description found'}
					</p>
				</div>

				<div className="flex items-center gap-1 text-sm text-muted-foreground">
					<Learning className="h-3 w-3" />
					<span className="truncate">
						{instructor.profile?.name ?? 'Unknown Instructor'}
					</span>
				</div>

				<div className="flex flex-wrap gap-1">
					{tags.map((tag) => (
						<Badge
							key={tag.tagId}
							variant="secondary"
							className="px-1 py-0 text-xs"
						>
							{tag.name}
						</Badge>
					))}
					{!tags.length && (
						<Badge
							variant="outline"
							className="px-1 py-0 text-xs text-muted-foreground"
						>
							None
						</Badge>
					)}
				</div>
			</CardContent>
			<CardFooter className="p-3 pt-0">
				<Button asChild size="sm" className="w-full text-sm">
					<Link href={`/courses/${courseId}`}>Continue</Link>
				</Button>
			</CardFooter>
		</Card>
	)
}
