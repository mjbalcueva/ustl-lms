'use client'

import { useMemo, useState } from 'react'
import { LuChevronRight } from 'react-icons/lu'

import { Button } from '@/client/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/client/components/ui/collapsible'
import { IconBadge } from '@/client/components/ui/icon-badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/client/components/ui/tooltip'
import { getIcon, type IconIdentifier } from '@/client/lib/icon-loader'

type CollapsibleSectionProps = React.ComponentProps<typeof Collapsible> & {
	title: string
	iconName: IconIdentifier
	children: React.ReactNode
	defaultOpen?: boolean
}

export const CollapsibleSection = ({
	title,
	iconName,
	children,
	defaultOpen = true,
	...props
}: CollapsibleSectionProps) => {
	const [isOpen, setIsOpen] = useState(defaultOpen)

	const IconComponent = useMemo(() => getIcon(iconName), [iconName])

	const toggleCollapsible = () => setIsOpen((prev) => !prev)

	return (
		<Collapsible open={isOpen} className="space-y-4" {...props}>
			<CollapsibleTrigger asChild>
				<h2
					className="flex select-none items-center gap-x-2 text-xl underline-offset-2 hover:cursor-pointer hover:underline md:min-w-[350px]"
					onClick={toggleCollapsible}
				>
					<IconBadge icon={IconComponent} />
					{title}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button size="sm" variant="ghost" className="ml-auto flex size-8 items-center gap-1 rounded-lg p-0">
								<LuChevronRight className={`size-4 transition-transform duration-150 ${isOpen ? 'rotate-90' : ''}`} />
							</Button>
						</TooltipTrigger>
						<TooltipContent>{isOpen ? 'Collapse' : 'Expand'}</TooltipContent>
					</Tooltip>
				</h2>
			</CollapsibleTrigger>
			{isOpen && <CollapsibleContent className="space-y-4">{children}</CollapsibleContent>}
		</Collapsible>
	)
}
