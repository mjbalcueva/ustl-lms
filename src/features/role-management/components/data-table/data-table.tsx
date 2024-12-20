'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { type Role } from '@prisma/client'
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

import { api, type RouterOutputs } from '@/services/trpc/react'

import { DataTablePagination } from '@/core/components/data-table/data-table-pagination'
import { DataTableToolbar } from '@/core/components/data-table/data-table-toolbar'
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

import { useColumns } from '@/features/role-management/components/data-table/data-table-column'

type User = RouterOutputs['roleManagement']['findManyUsers']['users'][number] & {
	department?: string | null
}

type DataTableProps<TData> = {
	data: TData[]
}

export const DataTable = <TData extends User>({
	data
}: DataTableProps<TData>) => {
	const router = useRouter()

	const { mutateAsync: editRole } = api.roleManagement.editUserRole.useMutation(
		{
			onSuccess: (data) => {
				toast.success(data.message)
				router.refresh()
			}
		}
	)

	const columns = useColumns(async (userId: string, newRole: Role, department?: string) => {
		await editRole({ userId, newRole, department })
	})

	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	)
	const [globalFilter, setGlobalFilter] = React.useState('')

	const table = useReactTable({
		data,
		columns: columns as ColumnDef<TData, unknown>[],
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		onSortingChange: setSorting,
		globalFilterFn: ({ original }, _, value: string) => {
			const searchValue = value.toLowerCase()
			const searchableFields = {
				id: original.id,
				name: original.name,
				email: original.email,
				role: original.role
			}

			return Object.values(searchableFields)
				.filter(Boolean)
				.some((value) => value?.toString().toLowerCase().includes(searchValue))
		},
		state: {
			columnFilters,
			sorting,
			globalFilter
		},
		initialState: {
			columnFilters,
			sorting,
			columnVisibility: {
				lastPromotion_promoterName: false,
				lastPromotion_roles: false,
				lastPromotion_date: false
			}
		}
	})

	const filterFields: DataTableFilterField<TData>[] = [
		{
			label: 'Role',
			value: 'role',
			options: [
				{ label: 'Registrar', value: 'REGISTRAR', withCount: true },
				{ label: 'Dean', value: 'DEAN', withCount: true },
				{ label: 'Program Chair', value: 'PROGRAM_CHAIR', withCount: true },
				{ label: 'Instructor', value: 'INSTRUCTOR', withCount: true },
				{ label: 'Student', value: 'STUDENT', withCount: true }
			]
		},
		{
			label: 'Changed By',
			value: 'lastPromotion_promoterName',
			options: Array.from(
				new Set(
					data
						.filter((user) => user.lastPromotion?.promoterName)
						.map((user) => user.lastPromotion?.promoterName ?? '')
				)
			).map((promoterName) => ({
				label: promoterName,
				value: promoterName,
				withCount: true
			}))
		}
	]

	return (
		<div className="space-y-2.5 pb-24">
			<DataTableToolbar
				table={table}
				filterFields={filterFields}
				globalFilter={globalFilter}
				setGlobalFilter={setGlobalFilter}
			/>
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
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
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
									className="bg-card hover:bg-accent dark:hover:bg-accent/20"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="py-2.5">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 !bg-card text-center"
								>
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
