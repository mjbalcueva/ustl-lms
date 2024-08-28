'use client'

import { usePathname } from 'next/navigation'
import * as React from 'react'

import { Icons } from '@/client/components/icons'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

const crumbIcons: Record<string, React.ReactNode> = {
	dashboard: <Icons.dashboard className="size-4" />,
	learning: <Icons.learning className="size-4" />,
	reports: <Icons.reports className="size-4" />,
	chat: <Icons.chat className="size-4" />,
	profile: <Icons.profile className="size-4" />,
	settings: <Icons.settings className="size-4" />
}

export const PageWrapper = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn('flex-grow overflow-auto border-t border-border bg-background md:rounded-xl md:border', className)}
			{...props}
		/>
	)
)
PageWrapper.displayName = 'PageWrapper'

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

export const PageContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => <div ref={ref} className={cn('mx-auto w-full max-w-2xl', className)} {...props} />
)
PageContainer.displayName = 'PageContainer'

export const PageHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => <div ref={ref} className={cn('space-y-2 p-4 pt-4 md:p-6', className)} {...props} />
)
PageHeader.displayName = 'PageHeader'

export const PageTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<h1 ref={ref} className={cn('w-fit text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
	)
)
PageTitle.displayName = 'PageTitle'

export const PageDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<p ref={ref} className={cn('w-fit text-sm text-muted-foreground', className)} {...props} />
	)
)
PageDescription.displayName = 'PageDescription'

export const PageContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => <div ref={ref} className={cn('p-4 pt-0 md:p-6 md:pt-0', className)} {...props} />
)
PageContent.displayName = 'PageContent'