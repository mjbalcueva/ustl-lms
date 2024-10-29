'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { type Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { useMediaQuery } from 'usehooks-ts'

import { useDeviceType } from '@/core/components/context/device-type-provider'
import { useNav } from '@/core/components/context/nav-provider'
import { PreferenceDrawer } from '@/core/components/nav-bar/preference-drawer'
import { PreferenceDropdown } from '@/core/components/nav-bar/preference-dropdown'
import { Avatar, AvatarFallback, AvatarImage } from '@/core/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/core/components/ui/dropdown-menu'
import { ChevronsUpDown, Logout, Profile, Settings } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'
import { getEmail } from '@/core/lib/utils/get-email'
import { getInitials } from '@/core/lib/utils/get-initials'

type UserButtonProps = React.ComponentProps<typeof DropdownMenu> & {
	session: Session | null
}

export const UserButton: React.FC<UserButtonProps> = ({ session, ...props }) => {
	const { isNavOpen } = useNav()
	const { deviceSize } = useDeviceType()

	const isMobile = deviceSize === 'mobile'
	const isTiny = useMediaQuery('(max-width: 500px)')

	const name = session?.user?.name ?? ''
	const email = session?.user?.email ?? ''

	const initials = getInitials(name)
	const strippedEmail = getEmail(email)

	return (
		<DropdownMenu modal={false} {...props}>
			<DropdownMenuTrigger className="group/user-button flex cursor-pointer items-center gap-3 rounded-md border border-background p-1 outline-none hover:border-border focus-visible:ring-2 focus-visible:ring-ring dark:border-transparent md:min-h-[2.8rem] md:hover:bg-card md:hover:shadow-[0_0_0_-2px_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.05)] dark:md:hover:border-border dark:md:hover:bg-accent/70">
				<Avatar className="size-8 border border-border md:ml-[1.5px]">
					<AvatarImage src={session?.user?.imageUrl ?? ''} alt={initials} className="select-none" />
					<AvatarFallback className="pointer-events-none select-none bg-muted">
						{initials}
					</AvatarFallback>
				</Avatar>
				{!isMobile && (
					<motion.div
						animate={{
							display: isNavOpen ? 'flex' : 'none',
							opacity: isNavOpen ? 1 : 0
						}}
						className={cn(
							'flex items-center justify-between whitespace-pre transition duration-150',
							isNavOpen ? 'min-w-[168px]' : 'hidden max-w-[0px]'
						)}
					>
						<div className="flex max-w-[9.5rem] flex-col items-start -space-y-0.5">
							<span className="max-w-full truncate text-sm font-medium">{name}</span>
							<span className="max-w-full truncate text-xs text-muted-foreground">
								{strippedEmail}
							</span>
						</div>
						<ChevronsUpDown className="mr-1.5 hidden size-4 group-hover/user-button:block group-focus/user-button:block" />
					</motion.div>
				)}
			</DropdownMenuTrigger>

			<DropdownMenuContent
				className="w-56 shadow-none"
				align={'end'}
				alignOffset={isMobile ? 0 : -10}
				side={isMobile ? 'bottom' : 'left'}
				sideOffset={isMobile ? 15 : 13}
			>
				{isMobile || !isNavOpen ? (
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
					<Link href="/profile" className="cursor-pointer">
						<Profile className="mr-2 size-4" />
						<span>Profile</span>
					</Link>
				</DropdownMenuItem>

				{isTiny ? (
					<PreferenceDrawer />
				) : (
					<PreferenceDropdown isMobile={isMobile} isNavOpen={isNavOpen} />
				)}

				<DropdownMenuItem asChild>
					<Link href="/settings" className="cursor-pointer">
						<Settings className="mr-2 size-4" />
						<span>Settings</span>
					</Link>
				</DropdownMenuItem>

				<DropdownMenuSeparator className="border" />

				<DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
					<Logout className="mr-2 size-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
