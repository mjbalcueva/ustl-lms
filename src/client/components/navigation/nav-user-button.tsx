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
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
	Skeleton
} from '@/client/components/ui'
import { useDeviceType, useNavContext } from '@/client/context'
import { useMediaQuery } from '@/client/lib/hooks'
import { themes } from '@/client/lib/themes'
import { cn, getEmail, getInitials } from '@/client/lib/utils'

export const UserButton = () => {
	const session = useSession()

	const name = session.data?.user?.name ?? ''
	const email = session.data?.user?.email ?? ''
	const image = session.data?.user?.image ?? ''

	const initials = getInitials(name)
	const strippedEmail = getEmail(email)

	const [mounted, setMounted] = useState(false)
	const [mode, setMode] = useState(() => {
		if (typeof window !== 'undefined') {
			return localStorage.getItem('mode') ?? 'dark'
		}
		return ''
	})

	const { isNavExpanded, setNavExpanded, setAnimate, animate } = useNavContext()
	const { theme, setTheme } = useTheme()
	const { deviceSize } = useDeviceType()
	const isMobile = deviceSize === 'mobile'
	const isTinyMobile = useMediaQuery('(max-width: 485px)')

	useEffect(() => {
		setMounted(true)
		const storedMode = localStorage.getItem('mode')
		if (storedMode) {
			setMode(storedMode)
		}
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

	if (!session.data || !mounted) {
		return (
			<div className="mx-2 p-1">
				<Skeleton className="size-8 rounded-full md:size-9" />
			</div>
		)
	} else
		return (
			<DropdownMenu
				modal={false}
				onOpenChange={(open) => {
					isMobile ? setNavExpanded(false) : setAnimate(!open)
				}}
			>
				<DropdownMenuTrigger className="mx-2 flex cursor-pointer items-center gap-3 rounded-md p-1 outline-none hover:bg-accent">
					{isMobile ? (
						<Avatar className="h-8 w-8 border border-border">
							<AvatarImage src={image} alt={initials} />
							<AvatarFallback>{initials}</AvatarFallback>
						</Avatar>
					) : (
						<>
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
						</>
					)}
				</DropdownMenuTrigger>

				<DropdownMenuContent className="w-56 shadow-none" align="end" sideOffset={isMobile ? 13 : 18}>
					<DropdownMenuLabel>
						{isMobile ? (
							<>
								<span className="block">{name}</span>
								<span className="font-normal text-muted-foreground">{strippedEmail}</span>
							</>
						) : (
							<>
								<span className="block">My Account</span>
							</>
						)}
					</DropdownMenuLabel>

					<DropdownMenuSeparator className="border" />

					<DropdownMenuItem asChild>
						<Link href="#link" className="cursor-pointer">
							<Icons.profile className="mr-2 h-4 w-4" />
							<span>Profile</span>
						</Link>
					</DropdownMenuItem>

					{isTinyMobile ? (
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
													className={cn(
														'w-28 flex-grow bg-card',
														theme === `${mode}-${themeOption.name}` && 'border-ring'
													)}
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
					) : (
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<Icons.theme className="mr-2 h-4 w-4" />
								<span>Preferences</span>
							</DropdownMenuSubTrigger>

							<DropdownMenuSubContent
								className="-mt-[2.3rem] w-64 py-2"
								alignOffset={0}
								sideOffset={isMobile ? 10 : 15}
							>
								<DropdownMenuLabel className="pb-2 text-xs">Mode</DropdownMenuLabel>
								<div className="flex gap-1.5 px-2 pb-1">
									<DropdownMenuItem asChild>
										<Button
											className={cn('flex-1 bg-card', mode === 'light' && 'border-ring')}
											variant={'outline'}
											size={'xs'}
											onClick={() => handleModeChange('light')}
										>
											<Icons.sun className="mr-2 h-4 w-4" />
											<span className="text-xs">Light</span>
										</Button>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Button
											className={cn('flex-1 bg-card', mode === 'dark' && 'border-ring')}
											variant={'outline'}
											size={'xs'}
											onClick={() => handleModeChange('dark')}
										>
											<Icons.moon className="mr-2 h-4 w-4" />
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
					)}

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
