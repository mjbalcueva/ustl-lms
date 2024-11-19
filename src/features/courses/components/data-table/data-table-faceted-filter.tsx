import { type Column } from '@tanstack/react-table'

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
import { Separator } from '@/core/components/ui/separator'
import { Check, CirclePlus } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'
import { type Option } from '@/core/types/data-table'

type DataTableFacetedFilterProps<TData, TValue> = {
	column?: Column<TData, TValue>
	title?: string
	options: Option[]
}

export const DataTableFacetedFilter = <TData, TValue>({
	column,
	title,
	options
}: DataTableFacetedFilterProps<TData, TValue>) => {
	const selectedValues = new Set(column?.getFilterValue() as string[])

	const handleSelect = (value: string) => {
		if (selectedValues.has(value)) {
			selectedValues.delete(value)
		} else {
			selectedValues.add(value)
		}
		const filterValues = Array.from(selectedValues)
		column?.setFilterValue(filterValues.length ? filterValues : undefined)
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="default" className="h-9 border-dashed">
					<CirclePlus className="h-4 w-4" />
					{title}
					{selectedValues?.size > 0 && (
						<>
							<Separator orientation="vertical" className="mx-2 h-4" />
							<Badge variant="secondary" className="rounded-lg px-1 font-normal lg:hidden">
								{selectedValues.size}
							</Badge>
							<div className="hidden space-x-1 lg:flex">
								{selectedValues.size > 2 ? (
									<Badge variant="secondary" className="rounded-lg px-1 font-normal">
										{selectedValues.size} selected
									</Badge>
								) : (
									options
										.filter((option) => selectedValues.has(option.value))
										.map((option) => (
											<Badge
												variant="secondary"
												key={option.value}
												className="rounded-lg px-1 font-normal"
											>
												{option.label}
											</Badge>
										))
								)}
							</div>
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0" align="start">
				<Command className="rounded-xl">
					<CommandInput placeholder={title} />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => {
								const isSelected = selectedValues.has(option.value)

								return (
									<CommandItem key={option.value} onSelect={() => handleSelect(option.value)}>
										<div
											className={cn(
												'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
												isSelected
													? 'bg-primary text-primary-foreground'
													: 'opacity-50 [&_svg]:invisible'
											)}
										>
											<Check className={cn('h-4 w-4')} />
										</div>
										{option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
										<span>{option.label}</span>
										{option.withCount && column?.getFacetedUniqueValues()?.get(option.value) && (
											<span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
												{column?.getFacetedUniqueValues().get(option.value)}
											</span>
										)}
									</CommandItem>
								)
							})}
						</CommandGroup>
						{selectedValues.size > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										onSelect={() => column?.setFilterValue(undefined)}
										className="justify-center rounded-lg text-center"
									>
										Clear filters
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
