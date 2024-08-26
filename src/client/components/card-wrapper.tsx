'use client'

import { usePathname } from 'next/navigation'
import * as React from 'react'

import { Icons } from '@/client/components/icons'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
	Card,
	CardContent,
	CardFooter,
	CardHeader
} from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

const crumbIcons: Record<string, React.ReactNode> = {
	dashboard: <Icons.dashboard className="size-4" />,
	learning: <Icons.learning className="size-4" />,
	reports: <Icons.reports className="size-4" />,
	chat: <Icons.chat className="size-4" />,
	profile: <Icons.profile className="size-4" />,
	settings: <Icons.settings className="size-4" />
}

type CardWrapperType = React.ComponentProps<typeof Card> & {
	showBreadcrumbs?: boolean
}

export const CardWrapper = ({ showBreadcrumbs, children, className, ...props }: CardWrapperType) => {
	const pathname = usePathname()
	const pathSegments = pathname.split('/').filter((segment) => segment !== '')

	return (
		<Card
			className={cn('h-full w-full overflow-y-auto rounded-none bg-background md:rounded-xl', className)}
			{...props}
		>
			{showBreadcrumbs && (
				<Breadcrumb>
					<BreadcrumbList className="hidden px-4 pb-0 pt-3 md:flex">
						<BreadcrumbItem>
							<BreadcrumbLink href="/dashboard" className="flex items-start gap-2">
								<Icons.logoMinimal className="size-4" />
								<span>Scholar</span>
							</BreadcrumbLink>
						</BreadcrumbItem>
						{pathSegments.map((segment, index) => {
							const href = `/${pathSegments.slice(0, index + 1).join('/')}`
							const icon = crumbIcons[segment.toLowerCase()]
							return (
								<React.Fragment key={href}>
									<BreadcrumbSeparator />
									<BreadcrumbItem>
										<BreadcrumbLink href={href} className="flex items-start gap-2">
											{icon}
											<span>{segment.charAt(0).toUpperCase() + segment.slice(1)}</span>
										</BreadcrumbLink>
									</BreadcrumbItem>
								</React.Fragment>
							)
						})}
					</BreadcrumbList>
				</Breadcrumb>
			)}
			{children}
		</Card>
	)
}

export const CardWrapperHeader = ({ children }: React.ComponentProps<typeof CardHeader>) => {
	return <CardHeader className="px-4 pt-4">{children}</CardHeader>
}

export const CardWrapperContent = ({ children }: React.ComponentProps<typeof CardContent>) => {
	return <CardContent className="px-4">{children}</CardContent>
}

export const CardWrapperFooter = ({ children }: React.ComponentProps<typeof CardFooter>) => {
	return <CardFooter className="px-4">{children}</CardFooter>
}
