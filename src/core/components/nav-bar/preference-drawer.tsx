import { Button } from '@/core/components/ui/button'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from '@/core/components/ui/drawer'
import { useUserTheme } from '@/core/lib/hooks/use-user-theme'
import { Dark, Light, Preference } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'

export const PreferenceDrawer = () => {
	const { theme, handleThemeChange, mode, handleModeChange, themeOptions } =
		useUserTheme()

	return (
		<Drawer>
			<DrawerTrigger className="flex w-full items-center rounded-md px-2 py-1.5 hover:bg-accent">
				<Preference className="mr-2 size-4" />
				<span className="text-sm">Preferences</span>
			</DrawerTrigger>

			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>Edit Preferences</DrawerTitle>
					<DrawerDescription>
						Choose your preferred mode and theme
					</DrawerDescription>
				</DrawerHeader>

				<div className="space-y-2 p-4">
					<div className="space-y-2">
						<h3 className="text-sm font-semibold">Mode</h3>
						<div className="flex flex-wrap gap-2 pb-1">
							<Button
								className={cn(
									'flex-grow bg-card',
									mode === 'light' && 'border-ring'
								)}
								variant={'outline'}
								size={'xs'}
								onClick={() => handleModeChange('light')}
							>
								<Light className="mr-2 size-4 shrink-0" />
								<span className="text-xs">Light</span>
							</Button>
							<Button
								className={cn(
									'flex-grow bg-card',
									mode === 'dark' && 'border-ring'
								)}
								variant={'outline'}
								size={'xs'}
								onClick={() => handleModeChange('dark')}
							>
								<Dark className="mr-2 size-4 shrink-0" />
								<span className="text-xs">Dark</span>
							</Button>
						</div>
					</div>

					<div className="space-y-2">
						<h3 className="text-sm font-semibold">Theme</h3>
						<div className="flex flex-wrap gap-2 pb-1">
							{themeOptions.map((themeOption) => (
								<Button
									key={themeOption.name}
									className={cn(
										'w-28 flex-grow bg-card',
										theme === `${mode}-${themeOption.name}` && 'border-ring'
									)}
									variant={'outline'}
									size={'xs'}
									onClick={() => handleThemeChange(mode, themeOption.name)}
								>
									<div
										className={`mr-2 size-4 shrink-0 rounded-full border ${themeOption.color}`}
									/>
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
