'use client'

import Link from 'next/link'

import { IconBadge } from '@/core/components/icon-badge'
import { buttonVariants } from '@/core/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/core/components/ui/tooltip'
import { Attachment, Clock } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'
import { formatDate } from '@/core/lib/utils/format-date'

type CourseAttachmentCardProps = {
	id: string
	name: string
	url: string
	createdAt: Date
}

export const CourseAttachmentCard = ({ id, name, url, createdAt }: CourseAttachmentCardProps) => {
	return (
		<Card key={id}>
			<CardHeader className="flex-row items-center gap-4 space-y-0 p-4">
				<Tooltip>
					<TooltipTrigger>
						<IconBadge icon={Attachment} size="lg" />
					</TooltipTrigger>
					<TooltipContent>Attachment</TooltipContent>
				</Tooltip>

				<div className="flex-1">
					<CardTitle className="text-base font-semibold">{name}</CardTitle>
					<CardDescription className="flex items-center gap-2">
						<span className="flex items-center gap-1">
							<Clock className="size-4" /> {formatDate(createdAt)}
						</span>
					</CardDescription>
				</div>

				<Link
					className={cn(buttonVariants({ size: 'sm' }), 'px-4')}
					href={url}
					target="_blank"
					rel="noopener noreferrer"
				>
					Download
				</Link>
			</CardHeader>
		</Card>
	)
}
