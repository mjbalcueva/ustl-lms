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
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/core/components/ui/popover'
import { Check, ChevronsUpDown, X } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'

import { CommandSkeleton } from '@/features/assessment/instructor/components/ui/command-skeleton'

type ChapterOption = {
	chapterId: string
	title: string
	content?: string
}

type ChaptersComboboxProps = {
	label: string
	options: ChapterOption[]
	selected: ChapterOption[]
	onChange: (value: ChapterOption[]) => void
	isLoading?: boolean
}

export const ChaptersCombobox = ({
	label,
	options,
	selected = [],
	onChange,
	isLoading
}: ChaptersComboboxProps) => {
	const [open, setOpen] = React.useState(false)
	const [value, setValue] = React.useState('')

	const selectedItems = React.useMemo(
		() => (Array.isArray(selected) ? selected : []),
		[selected]
	)

	const handleSelect = React.useCallback(
		(chapterId: string) => {
			const option = options.find((opt) => opt.chapterId === chapterId)
			if (!option) return

			const updatedSelected = selectedItems.some(
				(item) => item.chapterId === chapterId
			)
				? selectedItems.filter((item) => item.chapterId !== chapterId)
				: [...selectedItems, option]

			onChange(updatedSelected)
			setValue('')
		},
		[options, selectedItems, onChange]
	)

	const handleRemove = React.useCallback(
		(chapterId: string) => {
			const updatedSelected = selectedItems.filter(
				(item) => item.chapterId !== chapterId
			)
			onChange(updatedSelected)
		},
		[selectedItems, onChange]
	)

	const filteredOptions = React.useMemo(
		() =>
			options.filter((option) =>
				option.title.toLowerCase().includes(value.toLowerCase())
			),
		[options, value]
	)

	React.useEffect(() => {
		const handleClickOutside = () => setOpen(false)
		document.addEventListener('click', handleClickOutside)
		return () => document.removeEventListener('click', handleClickOutside)
	}, [])

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="size-full justify-between !bg-card"
					onClick={(e) => {
						e.stopPropagation()
						setOpen(!open)
					}}
				>
					<div className="flex flex-wrap gap-1">
						{selectedItems.map((item) => (
							<Badge
								key={item.chapterId}
								variant="secondary"
								className="mr-1 max-w-48 overflow-hidden text-ellipsis whitespace-nowrap"
								onClick={(e) => {
									e.stopPropagation()
									handleRemove(item.chapterId)
								}}
							>
								<span className="block overflow-hidden text-ellipsis whitespace-nowrap">
									{item.title}
								</span>
								<X className="ml-1 size-3 shrink-0 text-secondary-foreground" />
							</Badge>
						))}
						<span
							className={cn(
								'block',
								selectedItems.length > 0 ? 'text-muted-foreground' : ''
							)}
						>
							{selectedItems.length === 0 ? label : ''}
						</span>
					</div>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>

			<PopoverContent className="p-0" onClick={(e) => e.stopPropagation()}>
				<Command shouldFilter={false}>
					<CommandInput
						placeholder={`Search ${label.toLowerCase()}...`}
						value={value}
						onValueChange={setValue}
					/>
					<CommandList>
						{isLoading ? (
							<CommandSkeleton />
						) : (
							<>
								{filteredOptions.length === 0 && (
									<CommandEmpty>No chapters found.</CommandEmpty>
								)}
								<CommandGroup>
									{filteredOptions.map((option) => (
										<CommandItem
											key={option.chapterId}
											onSelect={() => handleSelect(option.chapterId)}
											className="cursor-pointer"
										>
											<Check
												className={cn(
													'mr-2 size-4',
													selectedItems.some(
														(item) => item.chapterId === option.chapterId
													)
														? 'opacity-100'
														: 'opacity-0'
												)}
											/>
											{option.title}
										</CommandItem>
									))}
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
