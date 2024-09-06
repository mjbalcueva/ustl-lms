'use client'

import { usePathname } from 'next/navigation'
import * as React from 'react'

import { account, home, instructor } from '@/shared/config/links'
import { type Link } from '@/shared/types/navigation'

import { Icons } from '@/client/components/icons'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/client/components/ui'

type PageBreadcrumbsProps = {
	withIcons?: boolean
}

export const PageBreadcrumbs = ({ withIcons = false }: PageBreadcrumbsProps) => {
	const pathname = usePathname()
	const pathSegments = pathname.split('/').filter((segment) => segment !== '')

	const allLinks = [...home, ...instructor, ...account]

	const getBreadcrumbs = (links: Link[], currentPath: string[]): Link[] => {
		for (const link of links) {
			if (link.href !== `/${currentPath.join('/')}` && !link.children) continue
			if (link.href === `/${currentPath.join('/')}`) return [link]

			const childResult = getBreadcrumbs(link.children ?? [], currentPath)
			if (childResult.length > 0) return [link, ...childResult]
		}
		return []
	}

	const breadcrumbs = getBreadcrumbs(allLinks, pathSegments)

	return (
		<Breadcrumb>
			<BreadcrumbList className="hidden px-4 pb-0 pt-3 md:flex md:px-6 md:pt-4">
				{breadcrumbs.map((crumb, index) => {
					const Icon = crumb.icon ? Icons[crumb.icon] : null

					return (
						<React.Fragment key={crumb.href}>
							{index > 0 && <BreadcrumbSeparator />}
							<BreadcrumbItem>
								<BreadcrumbLink href={crumb.href} className="flex items-center space-x-1.5">
									{withIcons && Icon && <Icon className="size-4" />}
									<span className="leading-none">{crumb.label}</span>
								</BreadcrumbLink>
							</BreadcrumbItem>
						</React.Fragment>
					)
				})}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
