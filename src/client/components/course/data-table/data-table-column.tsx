'use client'

import Link from 'next/link'
import * as React from 'react'
import { Status, type Course } from '@prisma/client'
import { type ColumnDef } from '@tanstack/react-table'
import { LuArchive, LuLink, LuTrash } from 'react-icons/lu'
import { TbCircle, TbCircleCheck, TbCircleDashed, TbDots, TbEdit } from 'react-icons/tb'
import { toast } from 'sonner'

import { DataTableColumnHeader } from '@/client/components/course/data-table/data-table-column-header'
import { Badge } from '@/client/components/ui/badge'
import { Button } from '@/client/components/ui/button'
import { ConfirmModal } from '@/client/components/ui/confirm-modal'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from '@/client/components/ui/dropdown-menu'
import { capitalize, formatDate, getBaseUrl } from '@/client/lib/utils'

export const useColumns = (
	editStatus: (id: string, status: Status) => Promise<void>,
	deleteCourse: (id: string) => Promise<void>
): ColumnDef<Course>[] => {
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
			accessorKey: 'token',
			header: ({ column }) => <DataTableColumnHeader column={column} title="Invite Token" />
		},
		{
			accessorKey: 'status',
			header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
			cell: ({ row }) => {
				switch (row.original.status) {
					case 'PUBLISHED':
						return <Badge>Published</Badge>
					case 'ARCHIVED':
						return <Badge variant="outline">Archived</Badge>
					default:
						return <Badge variant="secondary">Draft</Badge>
				}
			},
			filterFn: (row, id, value) => Array.isArray(value) && value.includes(row.getValue(id))
		},
		{
			accessorKey: 'createdAt',
			header: ({ column }) => <DataTableColumnHeader column={column} title="Created on" />,
			cell: ({ cell }) => formatDate(cell.getValue() as Date)
		},
		{
			accessorKey: 'updatedAt',
			header: ({ column }) => <DataTableColumnHeader column={column} title="Last updated" />,
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
						<Link href={`/courses/manage/${row.original.id}`}>
							<DropdownMenuItem>
								<TbEdit className="mr-2 size-4" />
								Edit
							</DropdownMenuItem>
						</Link>

						<DropdownMenuItem
							onSelect={(e) => {
								e.preventDefault()
								const enrollUrl = `${getBaseUrl()}/enrollment?token=${row.original.token}`
								navigator.clipboard.writeText(enrollUrl)
								toast.success('Invite link copied to clipboard!')
							}}
						>
							<LuLink className="mr-2 size-4" />
							Copy Invite Link
						</DropdownMenuItem>

						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<TbCircle className="mr-2 size-4" />
								Status
							</DropdownMenuSubTrigger>
							<DropdownMenuSubContent className="w-40" sideOffset={8}>
								<DropdownMenuRadioGroup
									value={row.original.status}
									onValueChange={(value) => editStatus(row.original.id, value as Status)}
								>
									{Object.values(Status).map((status) => {
										const IconMap = {
											PUBLISHED: TbCircleCheck,
											DRAFT: TbCircleDashed,
											ARCHIVED: LuArchive
										}
										const Icon = IconMap[status]
										return (
											<DropdownMenuRadioItem key={status} value={status}>
												<Icon className="mr-2 size-4" />
												{capitalize(status)}
											</DropdownMenuRadioItem>
										)
									})}
								</DropdownMenuRadioGroup>
							</DropdownMenuSubContent>
						</DropdownMenuSub>

						<DropdownMenuSeparator />

						<ConfirmModal
							title="Are you sure you want to delete this course?"
							description="This action cannot be undone. This will permanently delete your course and remove your data from our servers."
							onConfirm={() => deleteCourse(row.original.id)}
							actionLabel="Delete"
							variant="destructive"
						>
							<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
								<LuTrash className="mr-2 size-4 text-destructive" />
								Delete
							</DropdownMenuItem>
						</ConfirmModal>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	]
}
