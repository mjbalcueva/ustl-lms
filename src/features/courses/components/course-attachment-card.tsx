'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/core/components/ui/button'
import { Card } from '@/core/components/ui/card'
import { Attachment, Download } from '@/core/lib/icons'
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
			toast.error(
				`Error downloading file: ${error instanceof Error ? error.message : 'Unknown error'}`
			)
		} finally {
			setIsDownloading(false)
		}
	}

	return (
		<Card key={id} className="group relative flex items-center gap-3 overflow-hidden p-3">
			<div className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-background">
				<Attachment className="size-5 text-muted-foreground" />
			</div>

			<div className="flex-1 truncate">
				<p className="truncate text-sm font-medium leading-none">{name}</p>
				<p className="text-xs text-muted-foreground">{formatDate(createdAt)}</p>
			</div>

			<Button
				variant="ghost"
				size="icon"
				className="size-8 shrink-0 rounded-lg text-muted-foreground hover:text-foreground"
				onClick={handleDownload}
				disabled={isDownloading}
			>
				<Download className="!size-5" />
			</Button>
		</Card>
	)
}
