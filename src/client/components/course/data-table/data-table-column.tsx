'use client'

import Link from 'next/link'
import * as React from 'react'
import { type Course } from '@prisma/client'
import { type ColumnDef } from '@tanstack/react-table'
import { LuPencil, LuTrash } from 'react-icons/lu'
import { TbDots } from 'react-icons/tb'

import { ConfirmModal } from '@/client/components/confirm-modal'
import { DataTableColumnHeader } from '@/client/components/course/data-table/data-table-column-header'
import {
	Badge,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/client/components/ui'
import { formatDate } from '@/client/lib/utils'

export const useColumns = (mutateAsync: (id: string) => Promise<void>): ColumnDef<Course>[] => {
	return [
		{
			accessorKey: 'code',
			header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
			cell: ({ row }) => <Badge variant="outline">{row.original.code}</Badge>,
			enableSorting: false,
			enableHiding: false
		},
		{
			accessorKey: 'title',
			header: ({ column }) => <DataTableColumnHeader column={column} title="Title" className="min-w-40" />
		},
		{
			accessorKey: 'status',
			header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
			cell: ({ row }) => {
				const isPublished = row.original.status === 'PUBLISHED'
				return isPublished ? <Badge>Published</Badge> : <Badge variant="secondary">Draft</Badge>
			},
			filterFn: (row, id, value) => Array.isArray(value) && value.includes(row.getValue(id))
		},
		{
			accessorKey: 'createdAt',
			header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
			cell: ({ cell }) => formatDate(cell.getValue() as Date)
		},
		{
			accessorKey: 'updatedAt',
			header: ({ column }) => <DataTableColumnHeader column={column} title="Updated" />,
			cell: ({ cell }) => formatDate(cell.getValue() as Date)
		},
		{
			id: 'actions',
			cell: ({ row }) => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button aria-label="Open menu" variant="ghost" className="size-8 rounded-lg p-0 data-[state=open]:bg-muted">
							<TbDots className="size-4" aria-hidden="true" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-40">
						<Link href={`/courses/${row.original.id}/edit`}>
							<DropdownMenuItem>
								<LuPencil className="mr-2 size-3.5" />
								Edit
							</DropdownMenuItem>
						</Link>
						<ConfirmModal
							title="Are you sure you want to delete this course?"
							description="This action cannot be undone. This will permanently delete your course and remove your data from our servers."
							onConfirm={() => mutateAsync(row.original.id)}
						>
							<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
								<LuTrash className="mr-2 size-3.5" />
								Delete
							</DropdownMenuItem>
						</ConfirmModal>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	]
}
