'use client'

import * as React from 'react'

import { Icons } from '@/client/components/icons'
import {
	Breadcrumb as UIBreadcrumb,
	BreadcrumbItem as UIBreadcrumbItem,
	BreadcrumbLink as UIBreadcrumbLink,
	BreadcrumbList as UIBreadcrumbList,
	BreadcrumbSeparator as UIBreadcrumbSeparator
} from '@/client/components/ui'

export const Breadcrumbs = ({ children }: { children: React.ReactNode }) => {
	return (
		<UIBreadcrumb>
			<UIBreadcrumbList>{children}</UIBreadcrumbList>
		</UIBreadcrumb>
	)
}

export const BreadcrumbItem = ({ children }: { children: React.ReactNode }) => {
	return <UIBreadcrumbItem>{children}</UIBreadcrumbItem>
}

export const BreadcrumbLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
	return (
		<UIBreadcrumbItem>
			<UIBreadcrumbLink href={href} className="flex items-center gap-1.5">
				{children}
			</UIBreadcrumbLink>
		</UIBreadcrumbItem>
	)
}

export const BreadcrumbSeparator = () => {
	return <UIBreadcrumbSeparator />
}

export const BreadcrumbIcon = ({ icon }: { icon: keyof typeof Icons }) => {
	const Icon = Icons[icon]
	return <Icon className="size-4" />
}
