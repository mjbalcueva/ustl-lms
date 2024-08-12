'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'

import { type ThemeType } from '@/shared/types'

import { Icons } from '@/client/components/icons'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/client/components/ui'
import { useNavContext } from '@/client/context'
import { themes } from '@/client/lib/themes'
import { cn, getEmail, getInitials } from '@/client/lib/utils'

export const TopUserButton = () => {
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

	const { setNavExpanded } = useNavContext()
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
		<DropdownMenu modal={false} onOpenChange={() => setNavExpanded(false)}>
			<DropdownMenuTrigger className="mx-2 flex cursor-pointer items-center gap-3 rounded-md p-1 outline-none hover:bg-accent">
				<Avatar className="h-8 w-8 border border-border">
					<AvatarImage src={image} alt={initials} />
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-56 shadow-none" align="end" sideOffset={13}>
				<DropdownMenuLabel>
					<span className="block">{name}</span>
					<span className="font-normal text-muted-foreground">{strippedEmail}</span>
				</DropdownMenuLabel>

				<DropdownMenuSeparator className="border" />

				<DropdownMenuItem asChild>
					<Link href="#link" className="cursor-pointer">
						<Icons.profile className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</Link>
				</DropdownMenuItem>

				<Drawer>
					<DrawerTrigger className="flex w-full items-center rounded-md px-2 py-1.5">
						<Icons.theme className="mr-2 h-4 w-4" />
						<span className="text-sm">Preferences</span>
					</DrawerTrigger>

					<DrawerContent>
						<DrawerHeader className="text-left">
							<DrawerTitle>Edit Preferences</DrawerTitle>
							<DrawerDescription>Choose your preferred mode and theme</DrawerDescription>
						</DrawerHeader>

						<div className="space-y-2 p-4">
							<div className="space-y-2">
								<h3 className="text-sm font-semibold">Mode</h3>
								<div className="flex flex-wrap gap-2 pb-1">
									<Button
										className={cn('flex-grow bg-card', mode === 'light' && 'border-ring')}
										variant={'outline'}
										size={'xs'}
										onClick={() => handleModeChange('light')}
									>
										<Icons.sun className="mr-2 h-4 w-4 shrink-0" />
										<span className="text-xs">Light</span>
									</Button>
									<Button
										className={cn('flex-grow bg-card', mode === 'dark' && 'border-ring')}
										variant={'outline'}
										size={'xs'}
										onClick={() => handleModeChange('dark')}
									>
										<Icons.moon className="mr-2 h-4 w-4 shrink-0" />
										<span className="text-xs">Dark</span>
									</Button>
								</div>
							</div>

							<div className="space-y-2">
								<h3 className="text-sm font-semibold">Theme</h3>
								<div className="flex flex-wrap gap-2 pb-1">
									{themes[mode as keyof ThemeType].map((themeOption) => (
										<Button
											key={themeOption.name}
											className={cn('w-28 flex-grow bg-card', theme === `${mode}-${themeOption.name}` && 'border-ring')}
											variant={'outline'}
											size={'xs'}
											onClick={() => setTheme(`${mode}-${themeOption.name}`)}
										>
											<div className={`mr-2 h-4 w-4 shrink-0 rounded-full border ${themeOption.color}`} />
											<span className="text-xs">
												{themeOption.name.charAt(0).toUpperCase()}
												{themeOption.name.slice(1)}
											</span>
										</Button>
									))}
								</div>
							</div>
						</div>

						<DrawerFooter>
							<DrawerClose asChild>
								<Button size={'sm'}>Done</Button>
							</DrawerClose>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>

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
