'use client'

import Link from 'next/link'
import { type Course } from '@prisma/client'
import { type ColumnDef } from '@tanstack/react-table'
import { LuArrowUpDown, LuMoreHorizontal, LuPencil } from 'react-icons/lu'

import {
	Badge,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

export const columns: ColumnDef<Course>[] = [
	{
		accessorKey: 'code',
		header: ({ column }) => {
			return (
				<Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Code
					<LuArrowUpDown className="ml-2 size-3" />
				</Button>
			)
		}
	},
	{
		accessorKey: 'title',
		header: ({ column }) => {
			return (
				<Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Title
					<LuArrowUpDown className="ml-2 size-3" />
				</Button>
			)
		}
	},
	{
		accessorKey: 'isPublished',
		header: ({ column }) => {
			return (
				<Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Published
					<LuArrowUpDown className="ml-2 size-3" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const { status } = row.original

			const isPublished = status === 'PUBLISHED'

			return (
				<Badge
					className={cn(isPublished ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground')}
				>
					{isPublished ? 'Published' : 'Draft'}
				</Badge>
			)
		}
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const { id } = row.original

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="size-8 p-0">
							<span className="sr-only">Open menu</span>
							<LuMoreHorizontal className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<Link href={`/courses/${id}/edit`}>
							<DropdownMenuItem>
								<LuPencil className="mr-2 size-3.5" />
								Edit
							</DropdownMenuItem>
						</Link>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	}
]
