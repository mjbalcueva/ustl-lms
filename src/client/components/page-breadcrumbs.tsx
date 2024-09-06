'use client'

import { usePathname } from 'next/navigation'
import * as React from 'react'

import { Icons } from '@/client/components/icons'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/client/components/ui'

type PageBreadcrumbsProps = {
	withIcons?: boolean
}

export const PageBreadcrumbs = ({ withIcons = false }: PageBreadcrumbsProps) => {
	const pathname = usePathname()
	const pathSegments = pathname.split('/').filter((segment) => segment !== '')

	return (
		<Breadcrumb>
			<BreadcrumbList className="hidden px-4 pb-0 pt-3 md:flex md:px-6 md:pt-4">
				<BreadcrumbItem>
					<BreadcrumbLink href="/dashboard" className="flex items-center space-x-2">
						{withIcons && <Icons.logo className="size-4" />}
						<span className="leading-none">Scholar</span>
					</BreadcrumbLink>
				</BreadcrumbItem>
				{pathSegments.map((segment, index) => {
					const href = `/${pathSegments.slice(0, index + 1).join('/')}`
					const icon = segment.toLowerCase() as keyof typeof Icons
					const Icon = Icons[icon]

					return (
						<React.Fragment key={href}>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink href={href} className="flex items-center space-x-2">
									{withIcons && Icon && <Icon className="size-4" />}
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
