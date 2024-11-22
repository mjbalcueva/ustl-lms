'use client'

import { useState } from 'react'

import { IconBadge } from '@/core/components/icon-badge'
import { Button } from '@/core/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/core/components/ui/tooltip'
import { Attachment, Clock } from '@/core/lib/icons'
import { formatDate } from '@/core/lib/utils/format-date'

type CourseAttachmentCardProps = {
	id: string
	name: string
	url: string
	createdAt: Date
}

export const CourseAttachmentCard = ({ id, name, url, createdAt }: CourseAttachmentCardProps) => {
	const [isDownloading, setIsDownloading] = useState(false)

	const handleDownload = async () => {
		try {
			setIsDownloading(true)
			window.open(url, '_blank', 'noopener,noreferrer')
		} catch (error) {
			console.error('Error downloading file:', error)
		} finally {
			setIsDownloading(false)
		}
	}

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

				<Button size="sm" onClick={handleDownload} disabled={isDownloading}>
					{isDownloading ? 'Downloading...' : 'Download'}
				</Button>
			</CardHeader>
		</Card>
	)
}
