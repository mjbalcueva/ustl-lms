import { type Column } from '@tanstack/react-table'
import { TbCheck, TbCirclePlus } from 'react-icons/tb'

import { type Option } from '@/shared/types/courses'

import {
	Badge,
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Separator
} from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

interface DataTableFacetedFilterProps<TData, TValue> {
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

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="h-10 rounded-xl border-dashed">
					<TbCirclePlus className="mr-2 size-4" />
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
											<Badge variant="secondary" key={option.value} className="rounded-lg px-1 font-normal">
												{option.label}
											</Badge>
										))
								)}
							</div>
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[12.5rem] rounded-xl p-0" align="start">
				<Command className="rounded-xl">
					<CommandInput placeholder={title} />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => {
								const isSelected = selectedValues.has(option.value)

								return (
									<CommandItem
										key={option.value}
										onSelect={() => {
											if (isSelected) {
												selectedValues.delete(option.value)
											} else {
												selectedValues.add(option.value)
											}
											const filterValues = Array.from(selectedValues)
											column?.setFilterValue(filterValues.length ? filterValues : undefined)
										}}
									>
										<div
											className={cn(
												'mr-2 flex size-4 items-center justify-center rounded-lg border border-primary',
												isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
											)}
										>
											<TbCheck className="size-4" aria-hidden="true" />
										</div>
										{option.icon && <option.icon className="mr-2 size-4 text-muted-foreground" aria-hidden="true" />}
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
										className="justify-center text-center"
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
