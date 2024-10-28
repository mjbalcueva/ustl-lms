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
	CommandList,
	CommandSeparator
} from '@/core/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/core/components/ui/popover'
import { Add, Check, ChevronsUpDown, X } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'

import { AddCategoryForm } from '@/features/courses/components/forms/add-category-form'

type CategoriesComboboxProps = {
	label: string
	options: {
		value: string
		label: string
	}[]
	selected: string[]
	onChange: (value: string[]) => void
}

export const CategoriesCombobox = ({
	label,
	options,
	selected,
	onChange
}: CategoriesComboboxProps) => {
	const [open, setOpen] = React.useState(false)

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
					className="size-full justify-between bg-card dark:bg-background"
				>
					<div className="flex flex-wrap items-center gap-1">
						{selected.length > 0 ? (
							<>
								{selected.map((value) => (
									<Badge
										key={value}
										variant="secondary"
										className="mr-1"
										onClick={() => handleRemove(value)}
									>
										{options.find((option) => option.value === value)?.label}
										<X className="ml-1 size-3 text-secondary-foreground" />
									</Badge>
								))}
								<span className="text-muted-foreground">Select tags...</span>
							</>
						) : (
							<span className="text-muted-foreground">{label}</span>
						)}
					</div>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
									onSelect={() => handleSelect(option.value)}
								>
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
					<CommandSeparator />
					<CommandList>
						<CommandGroup>
							<AddCategoryForm className="w-full">
								<CommandItem>
									<Add className="mr-2 size-4" />
									Add Tag
								</CommandItem>
							</AddCategoryForm>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}