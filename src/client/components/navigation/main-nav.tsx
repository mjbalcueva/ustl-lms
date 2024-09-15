'use client'

import { Inter } from 'next/font/google'
import { type motion } from 'framer-motion'

import { home, instructor } from '@/shared/config/links'

import { SideNav } from '@/client/components/navigation/side-nav'
import { TopNav } from '@/client/components/navigation/top-nav'
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

	if (!deviceSize)
		return (
			<div className="fixed bottom-0 left-0 right-0 top-0 z-50 grid place-items-center bg-card">
				<div className="flex flex-col items-center gap-6">
					<h1 className="text-lg font-semibold">
						<span className="inline-block animate-bounce">Loading</span>
					</h1>
				</div>
			</div>
		)

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
