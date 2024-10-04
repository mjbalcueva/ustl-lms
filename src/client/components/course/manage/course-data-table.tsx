import * as React from 'react'
import { flexRender, type Table as TanstackTable } from '@tanstack/react-table'

import { DataTablePagination } from '@/client/components/course/manage/course-data-table-pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/client/components/ui'
import { getCommonPinningStyles } from '@/client/lib/data-table'
import { cn } from '@/client/lib/utils'

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
	 * @type TanstackTable<TData>
	 */
	table: TanstackTable<TData>
}

export function DataTable<TData>({ table, children, className, ...props }: DataTableProps<TData>) {
	return (
		<div className={cn('w-full space-y-2.5 overflow-auto', className)} {...props}>
			{children}
			<div className="overflow-hidden rounded-xl border shadow-sm">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											colSpan={header.colSpan}
											style={{
												...getCommonPinningStyles({ column: header.column })
											}}
										>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											style={{
												...getCommonPinningStyles({ column: cell.column })
											}}
										>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex flex-col gap-2.5">
				<DataTablePagination table={table} />
			</div>
		</div>
	)
}
