'use client'

import * as React from 'react'
import type { Table } from '@tanstack/react-table'
import { TbX } from 'react-icons/tb'

import { type DataTableFilterField } from '@/shared/types/data-table'

import { DataTableFacetedFilter } from '@/client/components/course/data-table/data-table-faceted-filter'
import { DataTableViewOptions } from '@/client/components/course/data-table/data-table-view-options'
import { Button, Input } from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

type DataTableToolbarProps<TData> = React.HTMLAttributes<HTMLDivElement> & {
	table: Table<TData>
	filterFields?: DataTableFilterField<TData>[]
}

export function DataTableToolbar<TData>({
	table,
	filterFields = [],
	className,
	...props
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0

	const { searchableColumns, filterableColumns } = React.useMemo(() => {
		return {
			searchableColumns: filterFields.filter(
				(field): field is DataTableFilterField<TData> & { options?: never } => !field.options
			),
			filterableColumns: filterFields.filter(
				(
					field
				): field is DataTableFilterField<TData> & { options: NonNullable<DataTableFilterField<TData>['options']> } =>
					!!field.options
			)
		}
	}, [filterFields])

	return (
		<div className={cn('flex w-full items-center justify-between space-x-2', className)} {...props}>
			<div className="flex flex-1 items-center space-x-2">
				{searchableColumns.length > 0 &&
					searchableColumns.map(
						(column) =>
							table.getColumn(column.value as string) && (
								<Input
									key={column.value as string}
									placeholder={column.placeholder}
									value={(table.getColumn(column.value as string)?.getFilterValue() as string) ?? ''}
									onChange={(event) => table.getColumn(column.value as string)?.setFilterValue(event.target.value)}
									className="h-9 w-40 border-border !bg-card md:w-72"
								/>
							)
					)}
				{filterableColumns.length > 0 &&
					filterableColumns.map(
						(column) =>
							table.getColumn(column.value as string) && (
								<DataTableFacetedFilter
									key={column.value as string}
									column={table.getColumn(column.value as string)}
									title={column.label}
									options={column.options}
								/>
							)
					)}
				{isFiltered && (
					<Button
						aria-label="Reset filters"
						variant="ghost"
						className="h-9 px-2 lg:px-3"
						onClick={() => table.resetColumnFilters()}
					>
						Reset
						<TbX className="ml-2 size-4" aria-hidden="true" />
					</Button>
				)}
			</div>
			<DataTableViewOptions table={table} />
		</div>
	)
}
