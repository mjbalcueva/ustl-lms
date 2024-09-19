import * as React from 'react'
import { LuCheck, LuChevronsUpDown } from 'react-icons/lu'

import {
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

type ComboboxProps = {
	options: {
		value: string
		label: string
	}[]
	selected: string
	onChange: (value: string) => void
}

export const Combobox = ({ options, selected, onChange }: ComboboxProps) => {
	const [open, setOpen] = React.useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
					{selected ? options.find((option) => option.value === selected)?.label : 'Select framework...'}
					<LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0">
				<Command>
					<CommandInput placeholder="Search framework..." />
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
