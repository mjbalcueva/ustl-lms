import { buttonVariants } from '@/client/components/ui/button'
import {
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger
} from '@/client/components/ui/dropdown-menu'
import { Icons } from '@/client/components/ui/icons'
import { useUserTheme } from '@/client/lib/hooks/use-user-theme'
import { cn } from '@/client/lib/utils'

export const PreferenceDropdown = ({ isMobile }: { isMobile: boolean; isNavOpen: boolean }) => {
	const { theme, handleThemeChange, mode, handleModeChange, themeOptions } = useUserTheme()

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				<Icons.preference className="mr-2 h-4 w-4" />
				<span>Preferences</span>
			</DropdownMenuSubTrigger>

			<DropdownMenuPortal>
				<DropdownMenuSubContent className="w-64 py-2" alignOffset={isMobile ? -38 : -78} sideOffset={isMobile ? 10 : 9}>
					<DropdownMenuLabel className="pb-2 text-xs">Mode</DropdownMenuLabel>
					<div className="flex gap-1.5 px-2 pb-1">
						<DropdownMenuItem
							onClick={() => handleModeChange('light')}
							className={cn(
								buttonVariants({ variant: 'outline', size: 'xs' }),
								'w-[48.7%]',
								mode === 'light' && 'border-ring'
							)}
						>
							<Icons.light className="mr-2 h-4 w-4 shrink-0" />
							<span className="text-xs">Light</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleModeChange('dark')}
							className={cn(
								buttonVariants({ variant: 'outline', size: 'xs' }),
								'w-[48.7%]',
								mode === 'dark' && 'border-ring'
							)}
						>
							<Icons.dark className="mr-2 h-4 w-4 shrink-0" />
							<span className="text-xs">Dark</span>
						</DropdownMenuItem>
					</div>

					<DropdownMenuSeparator className="border" />

					<DropdownMenuLabel className="pb-2 text-xs">Theme</DropdownMenuLabel>
					<div className="flex flex-wrap gap-1.5 px-2 pb-1">
						{themeOptions.map((themeOption) => (
							<DropdownMenuItem
								key={themeOption.name}
								onClick={() => handleThemeChange(mode, themeOption.name)}
								className={cn(
									buttonVariants({ variant: 'outline', size: 'xs' }),
									'w-[48.7%]',
									theme === `${mode}-${themeOption.name}` && 'border-ring'
								)}
							>
								<div className={`mr-2 h-4 w-4 shrink-0 rounded-full border ${themeOption.color}`} />
								<span className="text-xs">
									{themeOption.name.charAt(0).toUpperCase()}
									{themeOption.name.slice(1)}
								</span>
							</DropdownMenuItem>
						))}
					</div>
				</DropdownMenuSubContent>
			</DropdownMenuPortal>
		</DropdownMenuSub>
	)
}
