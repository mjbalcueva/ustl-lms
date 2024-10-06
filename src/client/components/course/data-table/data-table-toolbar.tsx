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

export const DataTableToolbar = <TData,>({
	table,
	filterFields = [],
	className,
	...props
}: DataTableToolbarProps<TData>) => {
	const isFiltered = table.getState().columnFilters.length > 0

	const { searchableColumns, filterableColumns } = React.useMemo(() => {
		return {
			searchableColumns: filterFields.filter((field) => !field.options),
			filterableColumns: filterFields.filter((field) => field.options)
		}
	}, [filterFields])

	return (
		<div className={cn('flex w-full items-center justify-between space-x-2 overflow-auto p-1', className)} {...props}>
			<div className="flex flex-1 items-center space-x-2">
				{searchableColumns.length > 0 &&
					searchableColumns.map(
						(column) =>
							table.getColumn(column.value ? String(column.value) : '') && (
								<Input
									key={String(column.value)}
									placeholder={column.placeholder}
									value={(table.getColumn(String(column.value))?.getFilterValue() as string) ?? ''}
									onChange={(event) => table.getColumn(String(column.value))?.setFilterValue(event.target.value)}
									className="w-40 border-border !bg-card md:w-72"
								/>
							)
					)}
				{filterableColumns.length > 0 &&
					filterableColumns.map(
						(column) =>
							table.getColumn(column.value ? String(column.value) : '') && (
								<DataTableFacetedFilter
									key={String(column.value)}
									column={table.getColumn(column.value ? String(column.value) : '')}
									title={column.label}
									options={column.options ?? []}
								/>
							)
					)}
				{isFiltered && (
					<Button
						aria-label="Reset filters"
						variant="ghost"
						className="h-10 px-2 lg:px-3"
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
