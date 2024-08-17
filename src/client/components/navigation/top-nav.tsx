'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'

import { navLinks } from '@/shared/config/links'

import { Icons } from '@/client/components/icons'
import { NavLinkComponent, UserButton } from '@/client/components/navigation'
import { Button } from '@/client/components/ui'
import { useNav } from '@/client/lib/hooks/use-nav'
import { cn } from '@/client/lib/utils'

type TopNavProps = React.ComponentProps<typeof motion.div>

export const TopNav = ({ className, ...props }: TopNavProps) => {
	const { isNavOpen, setNavOpen } = useNav()

	const [showNav, setShowNav] = useState(true)
	const { scrollYProgress } = useScroll()

	useMotionValueEvent(scrollYProgress, 'change', (current) => {
		const previous = scrollYProgress.getPrevious()!
		setShowNav(previous === 0 || previous > current)
	})

	const toggleScroll = useCallback((disable: boolean) => {
		disable ? document.body.classList.add('overflow-hidden') : document.body.classList.remove('overflow-hidden')
	}, [])

	useEffect(() => {
		toggleScroll(isNavOpen)
	}, [isNavOpen, toggleScroll])

	return (
		<AnimatePresence>
			<motion.aside
				key="nav"
				initial={{
					opacity: 1,
					y: 0
				}}
				animate={{
					y: showNav ? 0 : -100, // Hide when scrolling down
					opacity: showNav ? 1 : 0
				}}
				transition={{
					duration: 0.2
				}}
				className={cn(
					'sticky top-0 flex h-14 items-center justify-between border-b border-border px-2 backdrop-blur-xl sm:px-4 md:hidden',
					className
				)}
				{...props}
			>
				<Button
					variant={'ghost'}
					size={'icon'}
					onClick={() => setNavOpen(!isNavOpen)}
					className="outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
					aria-label={isNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
				>
					{isNavOpen ? <Icons.sidebarClose className="h-6 w-6" /> : <Icons.sidebarOpen className="h-6 w-6" />}
				</Button>

				<Link
					className="flex items-center justify-center gap-3 rounded-md p-1 text-lg font-semibold tracking-wide outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
					href="/dashboard"
					aria-label="Home"
				>
					<Icons.logo />
				</Link>

				<UserButton
					onOpenChange={(open) => {
						setNavOpen(false)
						toggleScroll(open)
					}}
				/>
			</motion.aside>

			<motion.nav
				key="nav-content"
				animate={isNavOpen ? 'animate' : 'exit'}
				initial="initial"
				exit="exit"
				variants={{
					initial: {
						opacity: 0,
						scale: 1
					},
					animate: {
						scale: 1,
						opacity: 1,
						transition: {
							duration: 0.2,
							ease: 'easeOut'
						}
					},
					exit: {
						opacity: 0,
						transition: {
							duration: 0.2,
							delay: 0.2,
							ease: 'easeOut'
						}
					}
				}}
				className={cn(
					'fixed top-14 h-full w-full overflow-auto bg-popover/50 text-popover-foreground backdrop-blur-xl md:hidden',
					!isNavOpen && 'pointer-events-none'
				)}
			>
				<motion.ul
					animate={isNavOpen ? 'open' : 'exit'}
					initial="initial"
					variants={{
						open: {
							transition: {
								staggerChildren: 0.06
							}
						}
					}}
					className="flex flex-col ease-in"
				>
					{navLinks.map((item, index) => (
						<motion.li
							key={index}
							variants={{
								initial: {
									y: '-30px',
									opacity: 0
								},
								open: {
									y: 0,
									opacity: 1,
									transition: {
										duration: 0.3,
										ease: 'easeOut'
									}
								}
							}}
						>
							<NavLinkComponent link={item} className="h-12 rounded-none border-b border-border md:rounded-md" />
						</motion.li>
					))}
				</motion.ul>
			</motion.nav>
		</AnimatePresence>
	)
}
