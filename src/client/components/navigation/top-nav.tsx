'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'

import { links, site } from '@/shared/config/links'

import { Icons } from '@/client/components/icons'
import { NavButton, NavIcon, NavItemSideIcon, NavLabel, NavLink } from '@/client/components/navigation/nav-item'
import { UserButton } from '@/client/components/navigation/user-button'
import { useNav } from '@/client/context/nav-provider'
import { cn } from '@/client/lib/utils'

export const TopNav = ({ className, ...props }: React.ComponentProps<typeof motion.div>) => {
	const { isNavOpen, setNavOpen } = useNav()

	const { scrollYProgress } = useScroll()
	const [showNav, setShowNav] = useState(true)
	const isUserButtonOpen = useRef(false)
	const MotionNavLink = useMemo(() => motion(NavLink), [])

	const navLinks = useMemo(() => {
		return [...(links.home ?? []), ...(links.instructor ?? [])]
	}, [])

	const toggleScroll = useCallback((disable: boolean) => {
		document.getElementById('body')?.classList.toggle('overflow-hidden', disable)
	}, [])

	useMotionValueEvent(scrollYProgress, 'change', (current) => {
		const previous = scrollYProgress.getPrevious()!
		setShowNav(previous === 0 || current === 1 || previous > current || isUserButtonOpen.current)
	})

	return (
		<AnimatePresence>
			<motion.nav
				key="nav"
				initial={{
					opacity: 1,
					y: 0
				}}
				animate={{
					y: showNav ? 0 : -100,
					opacity: 1
				}}
				className={cn(
					'sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border px-2 backdrop-blur-xl sm:px-4 md:hidden',
					className
				)}
				{...props}
			>
				<NavButton className="m-0 p-2" onClick={() => setNavOpen(!isNavOpen)}>
					{isNavOpen ? <Icons.navbarClose className="size-6" /> : <Icons.navbarOpen className="size-6" />}
				</NavButton>

				<NavButton className="m-0 p-1.5">
					<NavIcon icon={site.icon} className="size-7" />
				</NavButton>

				<UserButton
					onOpenChange={(open) => {
						isUserButtonOpen.current = open
						setNavOpen(false)
						toggleScroll(open)
					}}
				/>
			</motion.nav>

			{isNavOpen && (
				<motion.aside
					key="aside"
					initial="exit"
					animate={isNavOpen ? 'open' : 'exit'}
					exit="exit"
					variants={{
						open: { opacity: 1 },
						exit: { opacity: 0 }
					}}
					onAnimationEnd={() => setNavOpen(false)}
					className="fixed top-14 z-10 h-full w-full overflow-auto bg-card/50 text-card-foreground backdrop-blur-xl md:hidden"
				>
					{navLinks?.map((item, index) => (
						<MotionNavLink
							key={index}
							href={item.href ?? ''}
							className="m-0 h-12 rounded-none border-b border-border md:rounded-md"
							initial={{
								y: -100,
								opacity: 0
							}}
							animate={{
								y: 0,
								opacity: 1
							}}
							exit={{
								y: -100,
								opacity: 0
							}}
							transition={{
								type: 'spring',
								stiffness: 300,
								damping: 20,
								delay: index * 0.05
							}}
							onClick={() => setNavOpen(false)}
						>
							{item.icon && <NavIcon icon={item.icon} className="size-5" />}
							{item.label && <NavLabel label={item.label} />}
							<NavItemSideIcon className="size-5" />
						</MotionNavLink>
					))}
				</motion.aside>
			)}
		</AnimatePresence>
	)
}
