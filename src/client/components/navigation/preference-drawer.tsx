import { Icons } from '@/client/components/icons'
import {
	Button,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from '@/client/components/ui'
import { useUserTheme } from '@/client/lib/hooks/use-user-theme'
import { cn } from '@/client/lib/utils'

export const PreferenceDrawer = () => {
	const { theme, setTheme, mode, handleModeChange, currentThemes } = useUserTheme()

	return (
		<Drawer>
			<DrawerTrigger className="flex w-full items-center rounded-md px-2 py-1.5 hover:bg-accent">
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
							{currentThemes.map((themeOption) => (
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
	)
}
