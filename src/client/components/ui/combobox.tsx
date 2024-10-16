import * as React from 'react'
import { LuCheck, LuChevronsUpDown } from 'react-icons/lu'

import { Button } from '@/client/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from '@/client/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/client/components/ui/popover'
import { cn } from '@/client/lib/utils'

type ComboboxProps = {
	label: string
	options: {
		value: string
		label: string
	}[]
	selected: string
	onChange: (value: string) => void
}

export const Combobox = ({ label, options, selected, onChange }: ComboboxProps) => {
	const [open, setOpen] = React.useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between bg-card dark:bg-background"
				>
					{selected ? options.find((option) => option.value === selected)?.label : label ? label : 'Select...'}
					<LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0">
				<Command>
					<CommandInput placeholder={label ? label : 'Search...'} />
					<CommandList>
						<CommandEmpty>No option found.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									value={option.value}
									onSelect={() => {
										onChange(option.value === selected ? '' : option.value)
										setOpen(false)
									}}
								>
									<LuCheck className={cn('mr-2 h-4 w-4', selected === option.value ? 'opacity-100' : 'opacity-0')} />
									{option.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
