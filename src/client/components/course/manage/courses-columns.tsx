'use client'

import Link from 'next/link'
import * as React from 'react'
import { type Course } from '@prisma/client'
import { type ColumnDef } from '@tanstack/react-table'
import { LuPencil, LuTrash } from 'react-icons/lu'
import { TbDots } from 'react-icons/tb'

import {
	Badge,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/client/components/ui'
import { formatDate } from '@/client/lib/utils'

import { DataTableColumnHeader } from '../../data-table/data-table-column-header'

export const getColumns = (): ColumnDef<Course>[] => {
	return [
		{
			accessorKey: 'code',
			header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
			cell: ({ row }) => {
				const code = row.original.code

				return <div className="truncate font-medium">{code}</div>
			}
		},
		{
			accessorKey: 'title',
			header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
			cell: ({ row }) => {
				const title = row.original.title

				return (
					<div className="flex space-x-2">
						<span className="max-w-[31.25rem] truncate font-medium">{title}</span>
					</div>
				)
			}
		},
		{
			accessorKey: 'status',
			header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
			cell: ({ row }) => {
				const status = row.original.status

				if (!status) return null

				const isPublished = status === 'PUBLISHED'

				return (
					<div className="flex items-center">
						<Badge variant={isPublished ? 'default' : 'secondary'}>{isPublished ? 'Published' : 'Draft'}</Badge>
					</div>
				)
			},
			filterFn: (row, id, value) => {
				return Array.isArray(value) && value.includes(row.getValue(id))
			}
		},
		{
			accessorKey: 'createdAt',
			header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
			cell: ({ cell }) => formatDate(cell.getValue() as Date)
		},
		{
			id: 'actions',
			cell: function Cell({ row }) {
				const { id } = row.original

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
								<TbDots className="size-4" aria-hidden="true" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-40">
							<Link href={`/courses/${id}/edit`}>
								<DropdownMenuItem>
									<LuPencil className="mr-2 size-3.5" />
									Edit
								</DropdownMenuItem>
							</Link>

							<DropdownMenuItem>
								<LuTrash className="mr-2 size-3.5" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)
			},
			size: 40
		}
	]
}
