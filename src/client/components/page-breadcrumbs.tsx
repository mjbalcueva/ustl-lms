'use client'

import { usePathname } from 'next/navigation'
import * as React from 'react'

import { Icons } from '@/client/components/icons'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/client/components/ui'

type PageBreadcrumbsProps = {
	baseCrumb?: string
	withIcons?: boolean
}

export const PageBreadcrumbs = ({ baseCrumb, withIcons = false }: PageBreadcrumbsProps) => {
	const pathname = usePathname()
	const pathSegments = pathname.split('/').filter((segment) => segment !== '')

	const BaseCrumbIcon = baseCrumb ? Icons[baseCrumb.toLowerCase() as keyof typeof Icons] : null
	return (
		<Breadcrumb>
			<BreadcrumbList className="hidden px-4 pb-0 pt-3 md:flex md:px-6 md:pt-4">
				{baseCrumb && (
					<>
						<div className="flex select-none items-center space-x-1.5">
							{withIcons && BaseCrumbIcon && <BaseCrumbIcon className="size-4" />}
							<span className="leading-none">{baseCrumb}</span>
						</div>
						<BreadcrumbSeparator />
					</>
				)}

				{pathSegments.map((segment, index) => {
					const href = `/${pathSegments.slice(0, index + 1).join('/')}`
					const Icon = Icons[segment.toLowerCase() as keyof typeof Icons]

					return (
						<React.Fragment key={href}>
							{index > 0 && <BreadcrumbSeparator />}
							<BreadcrumbItem>
								<BreadcrumbLink href={href} className="flex items-center space-x-1.5">
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
