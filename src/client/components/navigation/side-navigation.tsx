'use client'

import { motion } from 'framer-motion'

import { siteConfig } from '@/shared/config/site'
import { type NavLink, type NavUser } from '@/shared/types'

import { Icons } from '@/client/components/icons'
import { NavLinkComponent, UserButton } from '@/client/components/navigation'
import { Separator } from '@/client/components/ui'
import { useNavContext } from '@/client/context'
import { cn } from '@/client/lib/utils'

export const SideNavigation = ({
	navLinks,
	className,
	...props
}: React.ComponentProps<typeof motion.div> & { navLinks: NavLink[] }) => {
	const { isNavExpanded, setNavExpanded, animate } = useNavContext()

	const user: NavUser = {
		name: 'Mark John Balcueva',
		email: 'markjohn.balcueva',
		avatar:
			'https://scontent.flgp1-1.fna.fbcdn.net/v/t39.30808-6/448224989_1004840857833378_7515964060620761005_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeExf6aj3n47tFXS7owstkS-FQVNljVX0e0VBU2WNVfR7aSGg4eQGbK2Ys-OJykl7TAm_vFbe_Jm4-A5iysbVtrd&_nc_ohc=yFDoQyXjQ9IQ7kNvgFXrkAL&_nc_ht=scontent.flgp1-1.fna&oh=00_AYAEbOLR7bCbxoVqmXBPM4qzEYlwPCEN5Fz9kCtg24Xj7w&oe=66A85844'
	}

	return (
		<motion.div
			className={cn('h-full w-[60px] flex-shrink-0 bg-popover py-4', className)}
			animate={{
				width: animate ? (isNavExpanded ? '240px' : '60px') : '240px'
			}}
			onMouseEnter={() => setNavExpanded(true)}
			onMouseLeave={() => setNavExpanded(false)}
			{...props}
		>
			<NavLinkComponent
				link={{
					label: siteConfig.title,
					href: '/',
					icon: <Icons.logo2 />
				}}
				isLogo
			/>

			<div className="mx-3 my-2">
				<Separator className="bg-muted" />
			</div>

			<div className="mx-2 flex flex-1 flex-col gap-2.5">
				{navLinks.map((link, index) => (
					<NavLinkComponent key={index} link={link} />
				))}
			</div>

			<div className="mx-3 my-2">
				<Separator className="bg-muted" />
			</div>

			<UserButton user={user} />
		</motion.div>
	)
}
