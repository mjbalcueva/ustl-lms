'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'

import { type ThemeType } from '@/shared/types'

import { Icons } from '@/client/components/icons'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from '@/client/components/ui'
import { useNavContext } from '@/client/context'
import { themes } from '@/client/lib/themes'
import { cn, getEmail, getInitials } from '@/client/lib/utils'

export const SideUserButton = () => {
	const session = useSession()

	const name = session.data?.user?.name ?? ''
	const email = session.data?.user?.email ?? ''
	const image = session.data?.user?.image ?? ''

	const initials = getInitials(name)
	const strippedEmail = getEmail(email)

	const [mode, setMode] = useState(() => {
		if (typeof window === 'undefined') return ''
		return localStorage.getItem('mode') ?? 'dark'
	})

	const { isNavExpanded, setAnimate, animate } = useNavContext()
	const { theme, setTheme } = useTheme()

	useEffect(() => {
		const storedMode = localStorage.getItem('mode')
		if (storedMode) setMode(storedMode)
	}, [])

	useEffect(() => {
		localStorage.setItem('mode', mode)
	}, [mode])

	const handleModeChange = (newMode: 'light' | 'dark') => {
		const selectedTheme = theme?.split('-')[1]
		const newTheme = `${newMode}-${selectedTheme}`
		setMode(newMode)
		setTheme(newTheme)
	}

	return (
		<DropdownMenu modal={false} onOpenChange={(open) => setAnimate(!open)}>
			<DropdownMenuTrigger className="mx-2 flex cursor-pointer items-center gap-3 rounded-md p-1 outline-none hover:bg-accent">
				<Avatar className="h-9 w-9 border border-border">
					<AvatarImage src={image} alt={initials} />
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>
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
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-56 shadow-none" align="end" sideOffset={18}>
				<DropdownMenuLabel>My Account</DropdownMenuLabel>

				<DropdownMenuSeparator className="border" />

				<DropdownMenuItem asChild>
					<Link href="#link" className="cursor-pointer">
						<Icons.profile className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</Link>
				</DropdownMenuItem>

				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<Icons.theme className="mr-2 h-4 w-4" />
						<span>Preferences</span>
					</DropdownMenuSubTrigger>

					<DropdownMenuSubContent className="-mt-[2.3rem] w-64 py-2" alignOffset={0} sideOffset={15}>
						<DropdownMenuLabel className="pb-2 text-xs">Mode</DropdownMenuLabel>
						<div className="flex gap-1.5 px-2 pb-1">
							<DropdownMenuItem asChild>
								<Button
									className={cn('flex-grow bg-card', mode === 'light' && 'border-ring')}
									variant={'outline'}
									size={'xs'}
									onClick={() => handleModeChange('light')}
								>
									<Icons.sun className="mr-2 h-4 w-4 shrink-0" />
									<span className="text-xs">Light</span>
								</Button>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Button
									className={cn('flex-grow bg-card', mode === 'dark' && 'border-ring')}
									variant={'outline'}
									size={'xs'}
									onClick={() => handleModeChange('dark')}
								>
									<Icons.moon className="mr-2 h-4 w-4 shrink-0" />
									<span className="text-xs">Dark</span>
								</Button>
							</DropdownMenuItem>
						</div>

						<DropdownMenuSeparator className="border" />

						<DropdownMenuLabel className="pb-2 text-xs">Theme</DropdownMenuLabel>
						<div className="flex flex-wrap gap-1.5 px-2 pb-1">
							{themes[mode as keyof ThemeType].map((themeOption) => (
								<DropdownMenuItem
									key={themeOption.name}
									onClick={() => setTheme(`${mode}-${themeOption.name}`)}
									asChild
								>
									<Button
										className={cn('w-[48.7%] bg-card', theme === `${mode}-${themeOption.name}` && 'border-ring')}
										variant={'outline'}
										size={'xs'}
									>
										<div className={`mr-2 h-4 w-4 shrink-0 rounded-full border ${themeOption.color}`} />
										<span className="text-xs">
											{themeOption.name.charAt(0).toUpperCase()}
											{themeOption.name.slice(1)}
										</span>
									</Button>
								</DropdownMenuItem>
							))}
						</div>
					</DropdownMenuSubContent>
				</DropdownMenuSub>

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
