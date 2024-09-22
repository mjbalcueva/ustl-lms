'use client'

import { Inter } from 'next/font/google'
import { type motion } from 'framer-motion'

import { home, instructor } from '@/shared/config/links'

import { SideNav } from '@/client/components/navigation/side-nav'
import { TopNav } from '@/client/components/navigation/top-nav'
import { NavSkeleton } from '@/client/components/skeleton/nav-skeleton'
import { useDeviceType } from '@/client/context/device-type-provider'
import { NavProvider } from '@/client/context/nav-provider'
import { useLinkFilter } from '@/client/lib/hooks/use-filtered-links'
import { cn } from '@/client/lib/utils'

const inter = Inter({
	subsets: ['latin'],
	display: 'swap'
})

type MainNavProps = React.ComponentProps<typeof motion.div> & {
	className?: string
}

export const MainNav = ({ className, ...props }: MainNavProps) => {
	const { deviceSize } = useDeviceType()
	const navLinks = [...useLinkFilter(home, 1), ...useLinkFilter(instructor, 1)]

	if (!deviceSize) return <NavSkeleton />

	return (
		<NavProvider>
			{deviceSize === 'mobile' ? (
				<TopNav
					links={navLinks.flatMap((link) => link.children!)}
					className={cn(className, inter.className)}
					{...props}
				/>
			) : (
				<SideNav links={navLinks} className={cn(className, inter.className)} {...props} />
			)}
		</NavProvider>
	)
}
