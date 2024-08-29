'use client'

import { usePathname } from 'next/navigation'
import * as React from 'react'

import { Icons } from '@/client/components/icons'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/client/components/ui'

const crumbIcons: Record<string, React.ReactNode> = {
	dashboard: <Icons.dashboard className="size-4" />,
	learning: <Icons.learning className="size-4" />,
	reports: <Icons.reports className="size-4" />,
	chat: <Icons.chat className="size-4" />,
	profile: <Icons.profile className="size-4" />,
	settings: <Icons.settings className="size-4" />
}

export const PageBreadcrumbs = () => {
	const pathname = usePathname()
	const pathSegments = pathname.split('/').filter((segment) => segment !== '')

	return (
		<Breadcrumb>
			<BreadcrumbList className="hidden px-4 pb-0 pt-3 md:flex md:px-6 md:pt-4">
				<BreadcrumbItem>
					<BreadcrumbLink href="/dashboard" className="flex items-center space-x-2">
						<Icons.logo className="size-4" />
						<span className="leading-none">Scholar</span>
					</BreadcrumbLink>
				</BreadcrumbItem>
				{pathSegments.map((segment, index) => {
					const href = `/${pathSegments.slice(0, index + 1).join('/')}`
					const icon = crumbIcons[segment.toLowerCase()]
					return (
						<React.Fragment key={href}>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink href={href} className="flex items-center space-x-2">
									{icon}
									<span className="leading-none">{segment.charAt(0).toUpperCase() + segment.slice(1)}</span>
								</BreadcrumbLink>
							</BreadcrumbItem>
						</React.Fragment>
					)
				})}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
