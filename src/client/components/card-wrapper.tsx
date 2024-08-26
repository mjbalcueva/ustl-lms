'use client'

import { usePathname } from 'next/navigation'

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
	Card
} from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

type CardWrapperType = React.ComponentProps<typeof Card> & {
	showBreadcrumbs?: boolean
}

export const CardWrapper = ({ showBreadcrumbs, children, className, ...props }: CardWrapperType) => {
	const pathname = usePathname()
	const pathSegments = pathname.split('/').filter((segment) => segment !== '')

	return (
		<Card
			className={cn('w-full overflow-y-auto rounded-none bg-background shadow-inner md:rounded-xl', className)}
			{...props}
		>
			{showBreadcrumbs && (
				<Breadcrumb className="p-4 pb-0">
					<BreadcrumbList>
						{pathSegments.map((segment, index) => {
							const href = `/${pathSegments.slice(0, index + 1).join('/')}`
							return (
								<>
									{index > 0 && <BreadcrumbSeparator />}
									<BreadcrumbItem key={href}>
										<BreadcrumbLink href={href}>{segment.charAt(0).toUpperCase() + segment.slice(1)}</BreadcrumbLink>
									</BreadcrumbItem>
								</>
							)
						})}
					</BreadcrumbList>
				</Breadcrumb>
			)}
			{children}
		</Card>
	)
}
