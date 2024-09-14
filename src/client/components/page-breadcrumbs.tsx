'use client'

import { usePathname } from 'next/navigation'
import * as React from 'react'

import { account, home, instructor } from '@/shared/config/links'
import { type Link } from '@/shared/types/navigation'

import { Icons } from '@/client/components/icons'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

type PageBreadcrumbsProps = {
	withIcons?: boolean
	className?: string
}

export const PageBreadcrumbs = ({ withIcons = false, className }: PageBreadcrumbsProps) => {
	const pathname = usePathname()
	const pathSegments = pathname.split('/').filter((segment) => segment !== '')

	console.log(pathSegments)

	const allLinks = [...home, ...instructor, ...account]

	const memoizedGetBreadcrumbs = React.useCallback((links: Link[], currentPath: string[]): Link[] => {
		for (const link of links) {
			if (link.href === `/${currentPath.join('/')}` && !link.children) return [link]

			const childResult = memoizedGetBreadcrumbs(link.children ?? [], currentPath)
			if (childResult.length > 0) return [link, ...childResult]
		}
		return []
	}, [])

	const breadcrumbs = memoizedGetBreadcrumbs(allLinks, pathSegments)

	console.log(breadcrumbs)

	return (
		<Breadcrumb>
			<BreadcrumbList className={cn(className)}>
				{breadcrumbs.map((crumb, index) => {
					const Icon = crumb.icon ? Icons[crumb.icon] : null
					const noHref = !crumb.href

					return (
						<React.Fragment key={crumb.label}>
							{index > 0 && <BreadcrumbSeparator />}
							<BreadcrumbItem className={cn(noHref && 'select-none gap-0 space-x-1.5')}>
								{noHref ? (
									<>
										{withIcons && Icon && <Icon className="size-4" />}
										<span className="leading-none">{crumb.label}</span>
									</>
								) : (
									<BreadcrumbLink href={crumb.href} className="flex items-center space-x-1.5">
										{withIcons && Icon && <Icon className="size-4" />}
										<span className="leading-none">{crumb.label}</span>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</React.Fragment>
					)
				})}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
