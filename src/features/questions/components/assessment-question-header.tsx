import { Badge } from '@/core/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/core/components/ui/tooltip'
import { Delete, Edit, GripVertical } from '@/core/lib/icons'

type AssessmentQuestionHeaderProps = {
	index: number
	points: number
	onEdit: () => void
	onDelete: () => void
}

export const AssessmentQuestionHeader = ({
	index,
	points,
	onEdit,
	onDelete,
	...dragHandleProps
}: AssessmentQuestionHeaderProps) => {
	return (
		<div className="flex items-center gap-2 px-2.5 pb-2.5 pt-3">
			<span
				className="rounded-md p-1.5 outline-none hover:bg-accent focus-visible:outline-ring"
				{...dragHandleProps}
			>
				<GripVertical className="size-4 shrink-0" />
			</span>

			<div className="flex flex-1 items-center gap-2">
				<Badge variant="secondary" className="text-sm font-medium leading-4">
					Question #{index + 1}
				</Badge>
				<span className="text-sm text-muted-foreground">
					({points} {points === 1 ? 'point' : 'points'})
				</span>
			</div>

			<Tooltip>
				<TooltipTrigger
					className="rounded-md p-1.5 outline-none hover:bg-accent focus-visible:outline-ring"
					onClick={onEdit}
				>
					<Edit className="size-4" />
				</TooltipTrigger>
				<TooltipContent>Edit</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger
					className="rounded-md p-1.5 outline-none hover:bg-accent focus-visible:outline-ring"
					onClick={onDelete}
				>
					<Delete className="size-4" />
				</TooltipTrigger>
				<TooltipContent>Delete</TooltipContent>
			</Tooltip>
		</div>
	)
}
