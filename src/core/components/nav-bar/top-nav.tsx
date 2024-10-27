'use client'

import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'

import { useNav } from '@/core/components/context/nav-provider'
import {
	NavButton,
	NavIcon,
	NavItemSideIcon,
	NavLabel,
	NavLink
} from '@/core/components/nav-bar/nav-item'
import { UserButton } from '@/core/components/nav-bar/user-button'
import { site } from '@/core/config/links'
import { useLockScroll } from '@/core/lib/hooks/use-lock-scroll'
import { Close, Open } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'
import { type Link } from '@/core/types/links'

type TopNavProps = React.ComponentProps<typeof motion.div> & {
	links: Link[]
	className?: string
}

export const TopNav = ({ links, className, ...props }: TopNavProps) => {
	const { isNavOpen, setNavOpen } = useNav()
	const { setLockScroll } = useLockScroll()

	const [showNav, setShowNav] = useState(true)

	const isUserButtonOpen = useRef(false)
	const { scrollYProgress } = useScroll()
	const MotionNavLink = useMemo(() => motion(NavLink), [])

	useMotionValueEvent(scrollYProgress, 'change', (current) => {
		const previous = scrollYProgress.getPrevious()!
		setShowNav(previous === 0 || current === 1 || previous > current || isUserButtonOpen.current)
	})

	return (
		<AnimatePresence>
			<motion.aside
				key="aside"
				initial={{
					opacity: 1,
					y: 0
				}}
				animate={{
					y: showNav ? 0 : -100,
					opacity: 1
				}}
				className={cn(
					'sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-card/40 px-2 backdrop-blur-xl sm:px-4 md:hidden',
					className
				)}
				{...props}
			>
				<NavButton
					className="m-0 p-2"
					onClick={() => {
						setNavOpen(!isNavOpen)
						setLockScroll(!isNavOpen)
					}}
				>
					{isNavOpen ? <Close className="size-6" /> : <Open className="size-6" />}
				</NavButton>

				<NavButton className="m-0 p-1.5">
					<NavIcon icon={site.icon} className="size-7" />
				</NavButton>

				<UserButton
					onOpenChange={(open: boolean) => {
						isUserButtonOpen.current = open
						setNavOpen(false)
						setLockScroll(open)
					}}
				/>
			</motion.aside>

			{isNavOpen && (
				<motion.nav
					key="nav"
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
					{links.map((item, index) => (
						<MotionNavLink
							key={index}
							href={item.href ?? ''}
							className="m-0 h-12 rounded-none border-b !border-border md:rounded-md"
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
							onClick={() => {
								setNavOpen(false)
								setLockScroll(false)
							}}
						>
							{item.icon && <NavIcon icon={item.icon} className="size-5" />}
							{item.label && <NavLabel label={item.label} />}
							<NavItemSideIcon className="size-5" />
						</MotionNavLink>
					))}
				</motion.nav>
			)}
		</AnimatePresence>
	)
}
