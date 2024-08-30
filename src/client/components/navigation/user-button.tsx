'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { type Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { TbLogout, TbSelector } from 'react-icons/tb'
import { useMediaQuery } from 'usehooks-ts'

import { Icons } from '@/client/components/icons'
import { PreferenceDrawer } from '@/client/components/navigation/preference-drawer'
import { PreferenceDropdown } from '@/client/components/navigation/preference-dropdown'
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
import { useDeviceType } from '@/client/context/device-type-provider'
import { useNav } from '@/client/lib/hooks/use-nav'
import { getEmail, getInitials } from '@/client/lib/utils'

type UserButtonProps = React.ComponentProps<typeof DropdownMenu> & {
	session: Session
}

export const UserButton: React.FC<UserButtonProps> = ({ session, ...props }: UserButtonProps) => {
	const user = session?.user

	const { isNavOpen, canNavOpen } = useNav()
	const { deviceSize } = useDeviceType()

	const isMobile = deviceSize === 'mobile'
	const isTiny = useMediaQuery('(max-width: 500px)')

	const name = user?.name ?? ''
	const email = user?.email ?? ''

	const initials = getInitials(name)
	const strippedEmail = getEmail(email)

	return (
		<DropdownMenu modal={false} {...props}>
			<DropdownMenuTrigger className="flex cursor-pointer items-center gap-3 rounded-md p-1 outline-none hover:bg-accent md:min-h-[2.8rem]">
				<Avatar className="size-8 border border-border md:ml-[1.5px]">
					<AvatarImage src={user?.image ?? ''} alt={initials} />
					<AvatarFallback className="pointer-events-none select-none bg-muted">{initials}</AvatarFallback>
				</Avatar>
				{!isMobile && (
					<motion.div
						animate={{
							display: canNavOpen ? (isNavOpen ? 'flex' : 'none') : 'flex',
							opacity: canNavOpen ? (isNavOpen ? 1 : 0) : 1
						}}
						className="hidden min-w-[168px] items-center justify-between whitespace-pre transition duration-150"
					>
						<div className="flex max-w-[9.5rem] flex-col items-start -space-y-0.5">
							<span className="max-w-full truncate text-sm font-medium">{name}</span>
							<span className="max-w-full truncate text-xs text-muted-foreground">{strippedEmail}</span>
						</div>
						<div className="relative right-0.5 rounded-md p-1">
							<TbSelector className="h-4 w-4 text-muted-foreground/80" />
						</div>
					</motion.div>
				)}
			</DropdownMenuTrigger>

			<DropdownMenuContent
				className="w-56 shadow-none"
				align={isMobile ? 'end' : 'start'}
				sideOffset={isMobile ? 13 : 25}
			>
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
					<Link href="/profile" className="cursor-pointer">
						<Icons.account.profile className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</Link>
				</DropdownMenuItem>

				{isTiny ? <PreferenceDrawer /> : <PreferenceDropdown isMobile={isMobile} />}

				<DropdownMenuItem asChild>
					<Link href="/settings" className="cursor-pointer">
						<Icons.account.settings className="mr-2 h-4 w-4" />
						<span>Settings</span>
					</Link>
				</DropdownMenuItem>

				<DropdownMenuSeparator className="border" />

				<DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
					<TbLogout className="mr-2 h-4 w-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
