import { ContentViewer } from '@/core/components/tiptap-editor/content-viewer'
import { Badge } from '@/core/components/ui/badge'
import { buttonVariants } from '@/core/components/ui/button'
import { DisclosureTrigger } from '@/core/components/ui/disclosure'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/core/components/ui/tooltip'
import { ChevronRight } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'

type AssessmentCardHeaderProps = React.ComponentProps<
	typeof DisclosureTrigger
> & {
	title: string
	instruction?: string
	className?: string
	shuffleQuestions?: boolean
	shuffleOptions?: boolean
}

export const AssessmentCardHeader = ({
	title,
	instruction,
	className,
	shuffleQuestions,
	shuffleOptions
}: AssessmentCardHeaderProps) => {
	return (
		<div className="flex flex-col space-y-1 p-6 pb-4">
			<DisclosureTrigger asChild>
				<div
					className={cn(
						'group flex items-center justify-between gap-x-2',
						className
					)}
				>
					<div className="flex items-center gap-2">
						<h3 className="text-lg font-semibold">{title}</h3>
						{shuffleQuestions && (
							<Badge variant="outline" className="gap-1">
								Shuffled
							</Badge>
						)}
						{shuffleOptions && (
							<Badge variant="outline" className="gap-1">
								Shuffled Options
							</Badge>
						)}
					</div>
					<Tooltip>
						<TooltipTrigger
							className={cn(
								buttonVariants({ variant: 'ghost' }),
								'size-8 rounded-lg text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground'
							)}
						>
							<ChevronRight className="transition-transform duration-300 group-data-[state=open]:rotate-90" />
						</TooltipTrigger>
						<TooltipContent>
							<span className="group-data-[state=open]:hidden">
								Expand Questions
							</span>
							<span className="hidden group-data-[state=open]:block">
								Collapse Questions
							</span>
						</TooltipContent>
					</Tooltip>
				</div>
			</DisclosureTrigger>
			{instruction && <ContentViewer className="text-sm" value={instruction} />}
		</div>
	)
}
