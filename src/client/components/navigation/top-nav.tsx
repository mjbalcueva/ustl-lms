'use client'

import Link from 'next/link'
import { useCallback, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { type Session } from 'next-auth'
import { TbLayoutSidebar, TbLayoutSidebarFilled } from 'react-icons/tb'

import { navLinks } from '@/shared/config/links'

import { Icons } from '@/client/components/icons'
import { NavLinkComponent } from '@/client/components/navigation/nav-link'
import { UserButton } from '@/client/components/navigation/user-button'
import { Button } from '@/client/components/ui'
import { useNav } from '@/client/lib/hooks/use-nav'
import { cn } from '@/client/lib/utils'

type NavProps = React.ComponentProps<typeof motion.div> & {
	session: Session
}
export const TopNav = ({ className, session, ...props }: NavProps) => {
	const MotionNavLink = useMemo(() => motion(NavLinkComponent), [])
	const { isNavOpen, setNavOpen } = useNav()

	const { scrollYProgress } = useScroll()
	const [showNav, setShowNav] = useState(true)
	const isUserButtonOpen = useRef(false)

	useMotionValueEvent(scrollYProgress, 'change', (current) => {
		const previous = scrollYProgress.getPrevious()!
		setShowNav(previous === 0 || current === 1 || previous > current || isUserButtonOpen.current)
	})

	const toggleScroll = useCallback((disable: boolean) => {
		document.getElementById('body')?.classList.toggle('overflow-hidden', disable)
	}, [])

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
				<Button
					variant={'ghost'}
					size={'icon'}
					onClick={() => {
						setNavOpen(!isNavOpen)
						toggleScroll(!isNavOpen)
					}}
					className="outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
					aria-label={isNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
				>
					{isNavOpen ? <TbLayoutSidebarFilled className="h-6 w-6" /> : <TbLayoutSidebar className="h-6 w-6" />}
				</Button>

				<Link
					className="flex items-center justify-center gap-3 rounded-md p-1 text-lg font-semibold tracking-wide outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
					href="/dashboard"
					aria-label="Home"
				>
					<Icons.logo className="size-7" />
				</Link>

				<UserButton
					session={session}
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
					{navLinks.map((item, index) => (
						<MotionNavLink
							key={index}
							link={item}
							variants={{
								open: {
									y: 0,
									opacity: 1
								},
								exit: {
									y: '-100px',
									opacity: 0
								}
							}}
							transition={{
								type: 'spring',
								stiffness: 300,
								damping: 20,
								duration: 1,
								delay: index * 0.05
							}}
							className="h-12 rounded-none border-b border-border md:rounded-md"
							onClick={() => setNavOpen(false)}
						/>
					))}
				</motion.aside>
			)}
		</AnimatePresence>
	)
}
