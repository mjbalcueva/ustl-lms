'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { signOut, useSession } from 'next-auth/react'

import { Icons } from '@/client/components/icons'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/client/components/ui'
import { useDeviceType, useNavContext } from '@/client/context'
import { getEmail, getInitials } from '@/client/lib/utils'

import { PreferenceDrawer } from './preference-drawer'
import { PreferenceDropdown } from './preference-dropdown'

export const UserButton = () => {
	const { isNavExpanded, setNavExpanded, setAnimate, animate } = useNavContext()
	const session = useSession()
	const { deviceSize } = useDeviceType()

	const name = session.data?.user.name ?? ''
	const email = session.data?.user.email ?? ''

	const initials = getInitials(name)
	const strippedEmail = getEmail(email)

	const isMobile = deviceSize === 'mobile'

	return (
		<DropdownMenu modal={false} onOpenChange={(open) => (isMobile ? setNavExpanded(false) : setAnimate(!open))}>
			<DropdownMenuTrigger className="mx-2 flex cursor-pointer items-center gap-3 rounded-md p-1 outline-none hover:bg-accent">
				<Avatar className="size-8 border border-border md:size-9">
					<AvatarImage src={session.data?.user.image ?? ''} alt={initials} />
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>
				{!isMobile && (
					<motion.div
						animate={{
							display: animate ? (isNavExpanded ? 'flex' : 'none') : 'flex',
							opacity: animate ? (isNavExpanded ? 1 : 0) : 1
						}}
						className="hidden min-w-[168px] items-center justify-between whitespace-pre transition duration-150"
					>
						<div className="flex max-w-[9rem] flex-col items-start">
							<span className="max-w-full truncate text-sm font-medium">{name}</span>
							<span className="max-w-full truncate text-xs text-muted-foreground">{strippedEmail}</span>
						</div>
						<div className="relative right-0.5 rounded-md p-1">
							<Icons.dropdown className="h-4 w-4 text-muted-foreground" />
						</div>
					</motion.div>
				)}
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-56 shadow-none" align="end" sideOffset={isMobile ? 13 : 18}>
				{isMobile ? (
					<DropdownMenuLabel>
						<span className="block">{name}</span>
						<span className="block font-normal text-muted-foreground">{strippedEmail}</span>
					</DropdownMenuLabel>
				) : (
					<DropdownMenuLabel>
						<span className="block">My Account</span>
					</DropdownMenuLabel>
				)}

				<DropdownMenuSeparator className="border" />

				<DropdownMenuItem asChild>
					<Link href="#link" className="cursor-pointer">
						<Icons.profile className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</Link>
				</DropdownMenuItem>

				{isMobile ? <PreferenceDrawer /> : <PreferenceDropdown />}

				<DropdownMenuItem asChild>
					<Link href="#link" className="cursor-pointer">
						<Icons.settings className="mr-2 h-4 w-4" />
						<span>Settings</span>
					</Link>
				</DropdownMenuItem>

				<DropdownMenuSeparator className="border" />

				<DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
					<Icons.logout className="mr-2 h-4 w-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
