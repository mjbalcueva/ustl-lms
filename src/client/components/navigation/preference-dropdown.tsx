import { Icons } from '@/client/components/icons'
import {
	Button,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger
} from '@/client/components/ui'
import { useUserTheme } from '@/client/lib/hooks/use-user-theme'
import { cn } from '@/client/lib/utils'

export const PreferenceDropdown = () => {
	const { theme, setTheme, mode, handleModeChange, currentThemes } = useUserTheme()

	return (
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
					{currentThemes.map((themeOption) => (
						<DropdownMenuItem key={themeOption.name} onClick={() => setTheme(`${mode}-${themeOption.name}`)} asChild>
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
	)
}
