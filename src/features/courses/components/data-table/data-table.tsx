'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { Status, type Course } from '@prisma/client'
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState
} from '@tanstack/react-table'
import { toast } from 'sonner'

import { api } from '@/services/trpc/react'

import { ScrollArea, ScrollBar } from '@/core/components/ui/scroll-area'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/core/components/ui/table'
import { type DataTableFilterField } from '@/core/types/data-table'

import { useColumns } from '@/features/courses/components/data-table/data-table-column'
import { DataTablePagination } from '@/features/courses/components/data-table/data-table-pagination'
import { DataTableToolbar } from '@/features/courses/components/data-table/data-table-toolbar'

type DataTableProps<TData> = {
	data: TData[]
}

export const DataTable = <TData extends Course>({ data }: DataTableProps<TData>) => {
	const router = useRouter()

	const { mutateAsync: editStatus } = api.course.editStatus.useMutation({
		onSuccess: (data) => {
			toast.success(data.message)
			router.refresh()
		}
	})

	const { mutateAsync: deleteCourse } = api.course.deleteCourse.useMutation({
		onSuccess: (data) => {
			toast.success(data.message)
			router.refresh()
		}
	})

	const columns = useColumns(
		async (id: string, status: Status) => {
			await editStatus({ id, status })
		},
		async (id: string) => {
			await deleteCourse({ id })
		}
	)

	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

	const table = useReactTable({
		data,
		columns: columns as ColumnDef<TData, unknown>[],
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		onSortingChange: setSorting,
		state: {
			columnFilters,
			sorting
		},
		initialState: {
			columnFilters,
			sorting,
			columnVisibility: {
				createdAt: false
			}
		}
	})

	const filterFields: DataTableFilterField<TData>[] = [
		{
			label: 'Title',
			value: 'title',
			placeholder: 'Filter titles...'
		},
		{
			label: 'Status',
			value: 'status',
			options: Object.values(Status).map((status) => ({
				label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
				value: status,
				withCount: true
			}))
		}
	]

	return (
		<div className="space-y-2.5 pb-24">
			<DataTableToolbar table={table} filterFields={filterFields} />
			<ScrollArea className="rounded-xl border shadow-sm">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} className="bg-card">
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
									className="!bg-card"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="py-2.5">
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 !bg-card text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
			<DataTablePagination table={table} />
		</div>
	)
}
