'use client'

import * as React from 'react'

import { Badge } from '@/core/components/ui/badge'
import { Button } from '@/core/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from '@/core/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/core/components/ui/popover'
import { Check, ChevronsUpDown, X } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'

type ChaptersComboboxProps = {
	label: string
	options: {
		value: string
		label: string
	}[]
	selected: string[]
	onChange: (value: string[]) => void
}

export const ChaptersCombobox = ({ label, options, selected, onChange }: ChaptersComboboxProps) => {
	const [open, setOpen] = React.useState(false)
	const [value, setValue] = React.useState('')

	const handleSelect = (value: string) => {
		const updatedSelected = selected.includes(value)
			? selected.filter((item) => item !== value)
			: [...selected, value]
		onChange(updatedSelected)
	}

	const handleRemove = (value: string) => {
		onChange(selected.filter((item) => item !== value))
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="size-full justify-between !bg-card"
				>
					<div className="flex flex-wrap gap-1">
						{selected.map((value) => (
							<Badge
								key={value}
								variant="secondary"
								className="mr-1 max-w-48 overflow-hidden text-ellipsis whitespace-nowrap"
								onClick={() => handleRemove(value)}
							>
								<span className="block overflow-hidden text-ellipsis whitespace-nowrap">
									{options.find((option) => option.value === value)?.label}
								</span>
								<X className="ml-1 size-3 shrink-0 text-secondary-foreground" />
							</Badge>
						))}
						<span className={cn('block', selected.length > 0 ? 'text-muted-foreground' : '')}>
							{label}
						</span>
					</div>

					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>

			<PopoverContent className="p-0">
				<Command shouldFilter={false}>
					<CommandInput placeholder={`${label}`} value={value} onValueChange={setValue} />
					<CommandList>
						<CommandEmpty>No chapters found.</CommandEmpty>
						<CommandGroup>
							{options
								.filter((option) => option.label.toLowerCase().includes(value.toLowerCase()))
								.map((option) => (
									<CommandItem key={option.value} onSelect={() => handleSelect(option.value)}>
										<Check
											className={cn(
												'mr-2 size-4',
												selected.includes(option.value) ? 'opacity-100' : 'opacity-0'
											)}
										/>
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
