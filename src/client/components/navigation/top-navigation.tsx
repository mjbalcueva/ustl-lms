'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'

import { type NavLink } from '@/shared/types'

import { Icons } from '@/client/components/icons'
import { NavLinkComponent, UserButton } from '@/client/components/navigation'
import { Button } from '@/client/components/ui'
import { useNavContext } from '@/client/context'
import { cn } from '@/client/lib/utils'

export const TopNavigation = ({
	navLinks,
	className,
	...props
}: React.ComponentProps<typeof motion.div> & { navLinks: NavLink[] }) => {
	const { isNavExpanded, setNavExpanded } = useNavContext()
	const [displayContent, setDisplayContent] = useState(false)

	const { scrollYProgress } = useScroll()
	const [isNavVisible, setNavVisible] = useState(true)

	useMotionValueEvent(scrollYProgress, 'change', (current) => {
		if (typeof current !== 'number') return
		const direction = current - scrollYProgress.getPrevious()!
		if (current === 1) setNavVisible(true)
		else !isNavExpanded && setNavVisible(direction < 0)
	})

	useEffect(() => {
		let timeoutId: string | number | NodeJS.Timeout | undefined
		if (isNavExpanded) {
			setDisplayContent(true)
		} else if (!isNavExpanded && displayContent) {
			timeoutId = setTimeout(() => {
				setDisplayContent(false)
			}, 500)
		}
		return () => clearTimeout(timeoutId)
	}, [isNavExpanded, displayContent])

	useEffect(() => {
		if (displayContent) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
	}, [displayContent])

	return (
		<>
			<AnimatePresence>
				<motion.aside
					initial={{
						opacity: 1,
						y: 0
					}}
					animate={{
						y: isNavVisible ? 0 : -100, // Hide when scrolling down
						opacity: isNavVisible ? 1 : 0
					}}
					transition={{
						duration: 0.2
					}}
					className={cn(
						'sticky top-0 flex h-14 items-center justify-between border-b border-border bg-popover/50 px-2 backdrop-blur-xl sm:px-4 md:hidden',
						className
					)}
					{...props}
				>
					<Button
						variant={'ghost'}
						size={'icon'}
						onClick={() => setNavExpanded(!isNavExpanded)}
						className="outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
					>
						{isNavExpanded ? (
							<Icons.sidebarClose className="h-6 w-6 text-popover-foreground" />
						) : (
							<Icons.sidebarOpen className="h-6 w-6 text-popover-foreground" />
						)}
					</Button>

					<Link
						className="flex items-center justify-center gap-3 rounded-md p-1 text-lg font-semibold tracking-wide outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
						href="/"
					>
						<Icons.logo2 />
					</Link>

					<UserButton />
				</motion.aside>
			</AnimatePresence>

			<AnimatePresence>
				{displayContent && (
					<motion.nav
						animate={isNavExpanded ? 'animate' : 'exit'}
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
							'fixed top-14 h-full w-full overflow-auto bg-popover/50 backdrop-blur-xl md:hidden',
							!isNavExpanded && 'pointer-events-none'
						)}
					>
						<motion.ul
							animate={isNavExpanded ? 'open' : 'exit'}
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
				)}
			</AnimatePresence>
		</>
	)
}
