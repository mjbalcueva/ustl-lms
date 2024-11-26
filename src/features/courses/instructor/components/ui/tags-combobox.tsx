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
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/core/components/ui/popover'
import { Add, Check, ChevronsUpDown, X } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'

import { AddTagForm } from '@/features/courses/instructor/components/forms/add-course-tags-form'

type TagsComboboxProps = {
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
}: TagsComboboxProps) => {
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
				<Command shouldFilter={false}>
					<CommandInput
						placeholder={`Search ${label.toLowerCase()}...`}
						value={value}
						onValueChange={setValue}
					/>
					<CommandList>
						<CommandEmpty>No option found.</CommandEmpty>
						<CommandGroup>
							{options
								.filter((option) =>
									option.label.toLowerCase().includes(value.toLowerCase())
								)
								.map((option) => (
									<CommandItem
										key={option.value}
										onSelect={() => handleSelect(option.value)}
									>
										<Check
											className={cn(
												'mr-2 size-4',
												selected.includes(option.value)
													? 'opacity-100'
													: 'opacity-0'
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
							<AddTagForm className="w-full">
								<CommandItem>
									<Add className="mr-2 size-4" />
									Add Tag
								</CommandItem>
							</AddTagForm>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
