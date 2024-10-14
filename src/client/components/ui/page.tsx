import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { type IconType } from 'react-icons/lib'
import { LuChevronsUpDown } from 'react-icons/lu'

import { type Breadcrumb as BreadcrumbType } from '@/shared/types/breadcrumbs'

import { Icons } from '@/client/components/icons'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Button,
	IconBadge
} from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

export const PageWrapper = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<main
			ref={ref}
			className={cn(
				'flex-grow overflow-auto border-border bg-card outline-none dark:bg-background md:rounded-xl md:border md:shadow-sm',
				className
			)}
			{...props}
		/>
	)
)
PageWrapper.displayName = 'PageWrapper'

export const PageContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn('mx-auto w-full max-w-2xl 2xl:max-w-3xl', className)} {...props} />
	)
)
PageContainer.displayName = 'PageContainer'

export const PageHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<header ref={ref} className={cn('space-y-2 px-2.5 py-4 sm:px-4 md:p-6', className)} {...props} />
	)
)
PageHeader.displayName = 'PageHeader'

export const PageBreadcrumbs = ({ crumbs }: { crumbs: BreadcrumbType }) => {
	const renderIcon = (icon: keyof typeof Icons) => {
		const Icon = Icons[icon]
		return <Icon className="size-4" />
	}

	return (
		<Breadcrumb className="w-fit">
			<BreadcrumbList>
				{crumbs.map((crumb, index) => (
					<React.Fragment key={index}>
						{index > 0 && <BreadcrumbSeparator />}
						<BreadcrumbItem>
							{index === crumbs.length - 1 && (
								<BreadcrumbPage className="flex items-center gap-1.5 rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground hover:cursor-default hover:text-foreground">
									{crumb.icon && renderIcon(crumb.icon)}
									{crumb.label}
								</BreadcrumbPage>
							)}

							{index !== crumbs.length - 1 && crumb.href && (
								<BreadcrumbLink
									href={crumb.href}
									className="flex items-center gap-1.5 underline-offset-4 hover:underline"
								>
									{crumb.icon && renderIcon(crumb.icon)}
									{crumb.label}
								</BreadcrumbLink>
							)}

							{index !== crumbs.length - 1 && !crumb.href && (
								<span className="flex items-center gap-1.5 hover:cursor-default hover:text-foreground">
									{crumb.icon && renderIcon(crumb.icon)}
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

export const PageTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<h1 ref={ref} className={cn('w-fit text-2xl font-semibold leading-none', className)} {...props} />
	)
)
PageTitle.displayName = 'PageTitle'

export const PageDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<p ref={ref} className={cn('w-fit text-sm text-muted-foreground', className)} {...props} />
	)
)
PageDescription.displayName = 'PageDescription'

type PageContentProps = React.HTMLAttributes<HTMLDivElement> & {
	asChild?: boolean
}
export const PageContent = React.forwardRef<HTMLDivElement, PageContentProps>(
	({ className, asChild, ...props }, ref) => {
		const Component = asChild ? Slot : 'div'
		return <Component ref={ref} className={cn(className)} {...props} />
	}
)
PageContent.displayName = 'PageContent'

type PageSectionProps = React.HTMLAttributes<HTMLDivElement> & {
	asChild?: boolean
	compactMode?: boolean
}
export const PageSection = React.forwardRef<HTMLDivElement, PageSectionProps>(
	({ className, asChild, compactMode, ...props }, ref) => {
		const Component = asChild ? Slot : 'section'
		return <Component ref={ref} className={cn(!compactMode && 'px-2.5 sm:px-4 md:px-6', className)} {...props} />
	}
)
PageSection.displayName = 'PageSection'

type PageSectionTitleProps = React.HTMLAttributes<HTMLDivElement> & {
	title: string
	icon: IconType
	toggle?: () => void
}
export const PageSectionTitle = ({ title, icon, toggle }: PageSectionTitleProps) => {
	return (
		<h2 className="mb-2.5 flex items-center gap-x-2 text-xl sm:mb-4 md:mb-5">
			<IconBadge icon={icon} />
			{title}
			<Button size="xs" variant="ghost" className="ml-auto size-7 rounded-lg px-0" onClick={toggle}>
				<LuChevronsUpDown className="size-4" />
			</Button>
		</h2>
	)
}
