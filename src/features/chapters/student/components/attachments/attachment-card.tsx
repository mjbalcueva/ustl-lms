'use client'

import { type inferProcedureOutput } from '@trpc/server'
import { toast } from 'sonner'

import { type AppRouter } from '@/server/api/root'

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import { Separator } from '@/core/components/ui/separator'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/core/components/ui/tooltip'
import { Attachment, Download } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'
import { formatDate } from '@/core/lib/utils/format-date'
import { removeExtension } from '@/core/lib/utils/remove-extension'

type AttachmentCardProps = {
	attachments: NonNullable<
		inferProcedureOutput<
			AppRouter['student']['chapter']['findOneChapter']
		>['chapter']
	>['attachments']
}

export const AttachmentCard = ({ attachments }: AttachmentCardProps) => {
	const handleDownload = async (url: string) => {
		try {
			window.open(url, '_blank', 'noopener,noreferrer')
		} catch (error) {
			toast.error(
				`Error downloading file: ${error instanceof Error ? error.message : 'Unknown error'}`
			)
		}
	}

	return (
		<Card>
			<CardHeader className="py-2">
				<CardTitle className="text-lg">Lesson Attachments</CardTitle>
			</CardHeader>

			<Separator />

			<CardContent className="p-2">
				{attachments.map((attachment) => (
					<div
						key={attachment.attachmentId}
						className={cn(
							'flex cursor-pointer items-center justify-between rounded-lg p-4 py-2 hover:bg-muted/50'
						)}
						onClick={() => handleDownload(attachment.url)}
					>
						<Tooltip>
							<TooltipTrigger
								className="flex flex-1 items-center gap-4"
								tabIndex={-1}
							>
								<Attachment className="h-4 w-4 shrink-0" />
								<div className="text-start">
									<p className="line-clamp-1 text-sm font-medium leading-none">
										{removeExtension(attachment.name)}
									</p>
									<p className="text-xs text-muted-foreground">
										{formatDate(attachment.createdAt, { month: 'short' })}
									</p>
								</div>
							</TooltipTrigger>
							<TooltipContent>{attachment.name}</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger className="flex size-8 shrink-0 items-center justify-center rounded-lg ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring">
								<Download className="size-4" />
							</TooltipTrigger>
							<TooltipContent>Download</TooltipContent>
						</Tooltip>
					</div>
				))}

				{attachments.length === 0 && (
					<div className="flex h-16 items-center justify-center">
						<p className="text-sm text-muted-foreground">
							No attachments found
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
