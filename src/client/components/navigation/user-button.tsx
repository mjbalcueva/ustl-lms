'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { signOut, useSession } from 'next-auth/react'
import { LuChevronsUpDown } from 'react-icons/lu'
import { useMediaQuery } from 'usehooks-ts'

import { PreferenceDrawer } from '@/client/components/navigation/preference-drawer'
import { PreferenceDropdown } from '@/client/components/navigation/preference-dropdown'
import { Avatar, AvatarFallback, AvatarImage } from '@/client/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/client/components/ui/dropdown-menu'
import { Icons } from '@/client/components/ui/icons'
import { useDeviceType } from '@/client/context/device-type-provider'
import { useNav } from '@/client/context/nav-provider'
import { cn, getEmail, getInitials } from '@/client/lib/utils'

export const UserButton: React.FC<React.ComponentProps<typeof DropdownMenu>> = ({ ...props }) => {
	const session = useSession()

	const { isNavOpen } = useNav()
	const { deviceSize } = useDeviceType()

	const isMobile = deviceSize === 'mobile'
	const isTiny = useMediaQuery('(max-width: 500px)')

	const name = session?.data?.user?.name ?? ''
	const email = session?.data?.user?.email ?? ''

	const initials = getInitials(name)
	const strippedEmail = getEmail(email)

	return (
		<DropdownMenu modal={false} {...props}>
			<DropdownMenuTrigger className="group/user-button flex cursor-pointer items-center gap-3 rounded-md border border-background p-1 outline-none hover:border-border focus-visible:ring-2 focus-visible:ring-ring dark:border-transparent md:min-h-[2.8rem] md:hover:bg-card md:hover:shadow-[0_0_0_-2px_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.05)] dark:md:hover:border-border dark:md:hover:bg-accent/70">
				<Avatar className="size-8 border border-border md:ml-[1.5px]">
					<AvatarImage src={session?.data?.user?.image ?? ''} alt={initials} className="select-none" />
					<AvatarFallback className="pointer-events-none select-none bg-muted">{initials}</AvatarFallback>
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
							<span className="max-w-full truncate text-xs text-muted-foreground">{strippedEmail}</span>
						</div>
						<LuChevronsUpDown className="mr-1.5 hidden size-4 group-hover/user-button:block group-focus/user-button:block" />
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
						<Icons.profile className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</Link>
				</DropdownMenuItem>

				{isTiny ? <PreferenceDrawer /> : <PreferenceDropdown isMobile={isMobile} isNavOpen={isNavOpen} />}

				<DropdownMenuItem asChild>
					<Link href="/settings" className="cursor-pointer">
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
