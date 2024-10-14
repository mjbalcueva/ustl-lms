'use client'

import { useMemo, useState } from 'react'
import { LuChevronRight } from 'react-icons/lu'

import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	IconBadge,
	PageSection,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/client/components/ui'
import { getIcon, type IconIdentifier } from '@/client/lib/icon-loader'

type CollapsibleSectionProps = React.ComponentProps<typeof PageSection> & {
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
		<PageSection compactMode {...props}>
			<Collapsible open={isOpen}>
				<CollapsibleTrigger asChild>
					<h2
						className="mb-2.5 flex select-none items-center gap-x-2 text-xl sm:mb-4 md:mb-5 md:min-w-[350px]"
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
				{isOpen && <CollapsibleContent>{children}</CollapsibleContent>}
			</Collapsible>
		</PageSection>
	)
}
