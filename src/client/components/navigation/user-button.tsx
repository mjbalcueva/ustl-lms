'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { signOut, useSession } from 'next-auth/react'
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
import { useDeviceType } from '@/client/context'
import { useNav } from '@/client/lib/hooks/use-nav'
import { getEmail, getInitials } from '@/client/lib/utils'

type UserButtonProps = React.ComponentProps<typeof DropdownMenu>

export const UserButton: React.FC<UserButtonProps> = ({ ...props }: UserButtonProps) => {
	const sesh = useSession()
	const user = sesh.data?.user

	const { isNavOpen, canNavOpen } = useNav()
	const { deviceSize } = useDeviceType()

	const isMobile = deviceSize === 'mobile'
	const isTiny = useMediaQuery('(max-width: 525px)')

	const name = user?.name ?? ''
	const email = user?.email ?? ''

	const initials = getInitials(name)
	const strippedEmail = getEmail(email)

	return (
		<DropdownMenu modal={false} {...props}>
			<DropdownMenuTrigger className="mx-2 flex cursor-pointer items-center gap-3 rounded-md p-1 outline-none hover:bg-accent md:min-h-[2.8rem]">
				<Avatar className="size-8 border border-border/50 dark:border-border md:ml-[1.5px]">
					<AvatarImage src={user?.image ?? ''} alt={initials} />
					<AvatarFallback className="bg-muted">{initials}</AvatarFallback>
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
							<Icons.dropdown className="h-4 w-4 text-muted-foreground/80" />
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

				{isTiny ? <PreferenceDrawer /> : <PreferenceDropdown />}

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
