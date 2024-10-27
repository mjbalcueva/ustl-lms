import { type IconType } from 'react-icons'

import { IconBadge } from '@/core/components/icon-badge'
import { buttonVariants } from '@/core/components/ui/button'
import { Disclosure, DisclosureContent, DisclosureTrigger } from '@/core/components/ui/disclosure'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/core/components/ui/tooltip'
import { ChevronRight } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'

type FoldableSectionProps = React.ComponentProps<typeof Disclosure> & {
	title: string
	icon: IconType
	duration?: number
}

export const FoldableBlock = ({
	title,
	icon,
	children,
	defaultOpen = true,
	duration,
	...props
}: FoldableSectionProps) => {
	return (
		<Disclosure defaultOpen={defaultOpen} transition={{ duration }} {...props}>
			<DisclosureTrigger asChild>
				<h2 className="group flex items-center gap-x-2 text-xl underline-offset-2 hover:cursor-pointer hover:underline md:min-w-[350px]">
					<IconBadge icon={icon} />
					{title}
					<Tooltip>
						<TooltipTrigger
							className={cn(
								buttonVariants({ variant: 'ghost' }),
								'ml-auto size-8 rounded-lg text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground'
							)}
						>
							<ChevronRight className="transition-transform duration-300 group-data-[state=open]:rotate-90" />
						</TooltipTrigger>
						<TooltipContent>
							<span className="group-data-[state=open]:hidden">Expand</span>
							<span className="hidden group-data-[state=open]:block">Collapse</span>
						</TooltipContent>
					</Tooltip>
				</h2>
			</DisclosureTrigger>
			<DisclosureContent className="space-y-4 [&>*:first-child]:mt-3">{children}</DisclosureContent>
		</Disclosure>
	)
}
