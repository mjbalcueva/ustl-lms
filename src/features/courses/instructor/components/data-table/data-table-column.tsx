'use client'

import Link from 'next/link'
import * as React from 'react'
import { Status, type Course } from '@prisma/client'
import { type ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

import { ConfirmModal } from '@/core/components/confirm-modal'
import { DataTableColumnHeader } from '@/core/components/data-table/data-table-column-header'
import { Badge } from '@/core/components/ui/badge'
import { Button } from '@/core/components/ui/button'
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
} from '@/core/components/ui/dropdown-menu'
import {
	Archive,
	Blank,
	Delete,
	DotsHorizontal,
	Draft,
	Edit,
	Link as LinkIcon,
	Publish
} from '@/core/lib/icons'
import { capitalize } from '@/core/lib/utils/capitalize'
import { formatDate } from '@/core/lib/utils/format-date'
import { getBaseUrl } from '@/core/lib/utils/get-base-url'

export const useColumns = (
	editStatus: (id: string, status: Status) => Promise<void>,
	deleteCourse: (id: string) => Promise<void>
): ColumnDef<Course>[] => {
	return [
		{
			accessorKey: 'code',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Code" />
			),
			cell: ({ row }) => <Badge variant="outline">{row.original.code}</Badge>,
			enableSorting: false,
			enableHiding: false
		},
		{
			accessorKey: 'title',
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Title"
					className="min-w-40"
				/>
			)
		},
		{
			accessorKey: 'token',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Invite Token" />
			)
		},
		{
			accessorKey: 'status',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Status" />
			),
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
			filterFn: (row, id, value) =>
				Array.isArray(value) && value.includes(row.getValue(id))
		},
		{
			accessorKey: 'createdAt',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Created on" />
			),
			cell: ({ cell }) => formatDate(cell.getValue() as Date)
		},
		{
			accessorKey: 'updatedAt',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Last updated" />
			),
			cell: ({ cell }) => formatDate(cell.getValue() as Date)
		},
		{
			id: 'actions',
			cell: ({ row }) => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							aria-label="Open menu"
							variant="ghost"
							className="size-8 rounded-lg p-0 data-[state=open]:bg-muted"
						>
							<DotsHorizontal className="size-4" aria-hidden="true" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-40">
						<Link href={`/instructor/courses/${row.original.courseId}`}>
							<DropdownMenuItem>
								<Edit className="mr-2 size-4" />
								Edit
							</DropdownMenuItem>
						</Link>

						<DropdownMenuItem
							onSelect={(e) => {
								e.preventDefault()
								const enrollUrl = `${getBaseUrl()}/enrollment?token=${row.original.token}`
								void navigator.clipboard.writeText(enrollUrl)
								toast.success('Invite link copied to clipboard!')
							}}
						>
							<LinkIcon className="mr-2 size-4" />
							Copy Invite Link
						</DropdownMenuItem>

						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<Blank className="mr-2 size-4" />
								Status
							</DropdownMenuSubTrigger>
							<DropdownMenuSubContent className="w-40" sideOffset={8}>
								<DropdownMenuRadioGroup
									value={row.original.status}
									onValueChange={(value) =>
										editStatus(row.original.courseId, value as Status)
									}
								>
									{Object.values(Status).map((status) => {
										const IconMap = {
											PUBLISHED: Publish,
											DRAFT: Draft,
											ARCHIVED: Archive
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
							onConfirm={() => deleteCourse(row.original.courseId)}
							actionLabel="Delete"
							variant="destructive"
						>
							<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
								<Delete className="mr-2 size-4 text-destructive" />
								Delete
							</DropdownMenuItem>
						</ConfirmModal>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	]
}
