'use client'

import * as React from 'react'

import { type Link } from '@/shared/types/navigation'

import { Icons } from '@/client/components/icons'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/client/components/ui'

export type Crumb = Omit<Link, 'children' | 'roles'>

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{crumbs.map((crumb, index) => (
					<React.Fragment key={index}>
						{index > 0 && <BreadcrumbSeparator />}
						<BreadcrumbItem>
							{index === crumbs.length - 1 ? (
								<BreadcrumbPage className="flex items-center gap-1.5">
									{crumb.icon && <BreadcrumbIcon icon={crumb.icon} />}
									{crumb.label}
								</BreadcrumbPage>
							) : crumb.href ? (
								<BreadcrumbLink href={crumb.href} className="flex items-center gap-1.5">
									{crumb.icon && <BreadcrumbIcon icon={crumb.icon} />}
									{crumb.label}
								</BreadcrumbLink>
							) : (
								<span className="flex items-center gap-1.5">
									{crumb.icon && <BreadcrumbIcon icon={crumb.icon} />}
									{crumb.label}
								</span>
							)}
						</BreadcrumbItem>
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	)
}

function BreadcrumbIcon({ icon }: { icon: keyof typeof Icons }) {
	const Icon = Icons[icon]
	return <Icon className="size-4" />
}
