import { type Table } from '@tanstack/react-table'
import { TbChevronLeft, TbChevronLeftPipe, TbChevronRight, TbChevronRightPipe } from 'react-icons/tb'

import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/client/components/ui'

type DataTablePaginationProps<TData> = {
	table: Table<TData>
	pageSizeOptions?: number[]
}

export const DataTablePagination = <TData,>({
	table,
	pageSizeOptions = [5, 10, 15, 20, 25]
}: DataTablePaginationProps<TData>) => {
	return (
		<div className="flex w-full items-center justify-end gap-4 p-1 pl-4 sm:flex-row sm:gap-6 lg:gap-8">
			<div className="flex items-center space-x-2">
				<p className="whitespace-nowrap text-sm font-medium">Rows per page</p>
				<Select
					value={`${table.getState().pagination.pageSize}`}
					onValueChange={(value) => {
						table.setPageSize(Number(value))
					}}
				>
					<SelectTrigger className="h-8 w-[4.5rem]">
						<SelectValue placeholder={table.getState().pagination.pageSize} />
					</SelectTrigger>
					<SelectContent side="top">
						{pageSizeOptions.map((pageSize) => (
							<SelectItem key={pageSize} value={`${pageSize}`}>
								{pageSize}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-center space-x-2">
				<Button
					aria-label="Go to first page"
					variant="outline"
					className="hidden size-8 p-0 lg:flex"
					onClick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					<TbChevronLeftPipe className="size-4" aria-hidden="true" />
				</Button>
				<Button
					aria-label="Go to previous page"
					variant="outline"
					size="icon"
					className="size-8"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<TbChevronLeft className="size-4" aria-hidden="true" />
				</Button>
				<Button
					aria-label="Go to next page"
					variant="outline"
					size="icon"
					className="size-8"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					<TbChevronRight className="size-4" aria-hidden="true" />
				</Button>
				<Button
					aria-label="Go to last page"
					variant="outline"
					size="icon"
					className="hidden size-8 lg:flex"
					onClick={() => table.setPageIndex(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}
				>
					<TbChevronRightPipe className="size-4" aria-hidden="true" />
				</Button>
			</div>
		</div>
	)
}
