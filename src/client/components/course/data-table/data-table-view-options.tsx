'use client'

import { type Table } from '@tanstack/react-table'
import { LuSettings2 } from 'react-icons/lu'

import { Button } from '@/client/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/client/components/ui/dropdown-menu'

type DataTableViewOptionsProps<TData> = {
	table: Table<TData>
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					aria-label="Display properties"
					variant="outline"
					className="ml-auto flex h-9 bg-card dark:bg-background"
				>
					<LuSettings2 className="mr-2 size-4" />
					View
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuLabel>Display properties</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{table
					.getAllColumns()
					.filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
					.map((column) => {
						const labelMap: Record<string, string> = {
							token: 'Invite Token',
							createdAt: 'Created on',
							updatedAt: 'Last Updated'
						}
						return (
							<DropdownMenuCheckboxItem
								key={column.id}
								className="truncate capitalize"
								checked={column.getIsVisible()}
								onCheckedChange={(value) => column.toggleVisibility(!!value)}
							>
								{labelMap[column.id] ?? column.id}
							</DropdownMenuCheckboxItem>
						)
					})}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
