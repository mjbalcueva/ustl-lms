'use client'

import { Button } from '@/core/components/ui/button'
import { Card } from '@/core/components/ui/card'
import { Attachment, Download } from '@/core/lib/icons'

import { type Resource } from '../types'

interface ChapterResourcesProps {
	resources: Resource[]
	onShare: (resourceId: string) => void
}

export const ChapterResources = ({ resources, onShare }: ChapterResourcesProps) => {
	return (
		<Card>
			<div className="border-b p-4">
				<h2 className="font-semibold">Lesson Resources</h2>
			</div>
			<div className="divide-y">
				{resources.map((resource) => (
					<div
						key={resource.id}
						className="flex items-center justify-between p-4 hover:bg-muted/50"
					>
						<div className="flex items-center gap-4">
							<Attachment className="h-4 w-4" />
							<div>
								<p className="font-medium">{resource.name}</p>
								<p className="text-sm text-muted-foreground">
									{resource.type} • {resource.size}
								</p>
							</div>
						</div>
						<Button variant="ghost" size="icon" onClick={() => onShare(resource.id)}>
							<Download className="h-4 w-4" />
						</Button>
					</div>
				))}
			</div>
		</Card>
	)
}
