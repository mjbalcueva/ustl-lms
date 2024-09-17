'use client'

import * as React from 'react'

import { Icons } from '@/client/components/icons'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/client/components/ui'

export type Crumb = {
	label?: string
	href?: string
	icon?: keyof typeof Icons
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
	return (
		<Breadcrumb className="hidden w-fit sm:block">
			<BreadcrumbList>
				{crumbs.map((crumb, index) => (
					<React.Fragment key={index}>
						{index > 0 && <BreadcrumbSeparator />}
						<BreadcrumbItem>
							{index === crumbs.length - 1 ? (
								<BreadcrumbPage className="flex items-center gap-1.5 rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground">
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
