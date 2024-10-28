'use client'

import * as React from 'react'
import { type Table } from '@tanstack/react-table'

import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { X } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'
import { type DataTableFilterField } from '@/core/types/data-table'

import { DataTableFacetedFilter } from '@/features/courses/components/data-table/data-table-faceted-filter'
import { DataTableViewOptions } from '@/features/courses/components/data-table/data-table-view-options'

type DataTableToolbarProps<TData> = React.HTMLAttributes<HTMLDivElement> & {
	table: Table<TData>
	filterFields?: DataTableFilterField<TData>[]
}

export const DataTableToolbar = <TData,>({
	table,
	filterFields = [],
	className,
	...props
}: DataTableToolbarProps<TData>) => {
	const isFiltered = table.getState().columnFilters.length > 0

	const { searchableColumns, filterableColumns } = React.useMemo(() => {
		return {
			searchableColumns: filterFields.filter(
				(field): field is DataTableFilterField<TData> & { options?: never } => !field.options
			),
			filterableColumns: filterFields.filter(
				(
					field
				): field is DataTableFilterField<TData> & {
					options: NonNullable<DataTableFilterField<TData>['options']>
				} => !!field.options
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
									value={
										(table.getColumn(column.value as string)?.getFilterValue() as string) ?? ''
									}
									onChange={(event) =>
										table.getColumn(column.value as string)?.setFilterValue(event.target.value)
									}
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
						<X className="ml-2 size-4" aria-hidden="true" />
					</Button>
				)}
			</div>
			<DataTableViewOptions table={table} />
		</div>
	)
}