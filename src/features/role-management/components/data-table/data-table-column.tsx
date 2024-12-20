'use client'

import * as React from 'react'
import { type Role } from '@prisma/client'
import { type ColumnDef } from '@tanstack/react-table'
import { useSession } from 'next-auth/react'

import { type RouterOutputs } from '@/services/trpc/react'

import { DataTableColumnHeader } from '@/core/components/data-table/data-table-column-header'
import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@/core/components/ui/avatar'
import { Button } from '@/core/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from '@/core/components/ui/dropdown-menu'
import { DotsHorizontal, User } from '@/core/lib/icons'
import { formatDate } from '@/core/lib/utils/format-date'

import { DepartmentFormModal } from '@/features/role-management/components/department-form-modal'
import { RoleBadge } from '@/features/role-management/components/role-badge'
import { getLimitedRoleVisibility } from '@/features/role-management/lib/get-limited-role-visibility'

type User =
	RouterOutputs['roleManagement']['findManyUsers']['users'][number] & {
		department?: string | null
	}

export const useColumns = (
	editRole: (
		userId: string,
		newRole: Role,
		department?: string
	) => Promise<void>
): ColumnDef<User>[] => {
	const { data: session } = useSession()
	const currentUserRole = session?.user?.role

	return [
		{
			accessorKey: 'name',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Name" />
			),
			cell: ({ row }) => {
				return (
					<div className="flex items-center gap-2">
						<Avatar className="size-7 border border-border">
							<AvatarImage src={row.original.imageUrl ?? ''} />
							<AvatarFallback>{row.original.name?.charAt(0)}</AvatarFallback>
						</Avatar>
						<div>{row.original.name}</div>
					</div>
				)
			}
		},
		{
			accessorKey: 'email',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Email" />
			)
		},
		{
			accessorKey: 'role',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Role" />
			),
			cell: ({ row }) => <RoleBadge role={row.original.role} />
		},
		{
			accessorKey: 'lastPromotion.roles',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Last Role" />
			),
			cell: ({ row }) => {
				const lastPromotion = row.original.lastPromotion
				if (!lastPromotion) {
					return <span className="text-sm text-muted-foreground">-</span>
				}

				return (
					<div className="flex items-center gap-2">
						<RoleBadge role={lastPromotion.oldRole} />
						→
						<RoleBadge role={lastPromotion.newRole} />
					</div>
				)
			}
		},
		{
			accessorKey: 'lastPromotion.promoterName',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Last Changed By" />
			),
			cell: ({ row }) => {
				const lastPromotion = row.original.lastPromotion
				if (!lastPromotion) {
					return <span className="text-sm text-muted-foreground">-</span>
				}

				return <span className="font-medium">{lastPromotion.promoterName}</span>
			}
		},
		{
			accessorKey: 'lastPromotion.date',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Last Change On" />
			),
			cell: ({ row }) => {
				const lastPromotion = row.original.lastPromotion
				if (!lastPromotion) {
					return <span className="text-sm text-muted-foreground">-</span>
				}

				return formatDate(new Date(lastPromotion.date), {
					month: 'short',
					day: 'numeric',
					year: 'numeric'
				})
			}
		},
		{
			accessorKey: 'department',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Department" />
			),
			cell: ({ row }) => {
				return <span className="text-sm">{row.original.department ?? '-'}</span>
			}
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				return (
					<DropdownMenu modal={false}>
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
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>
									<User className="mr-2 size-4" />
									Set Role
								</DropdownMenuSubTrigger>
								<DropdownMenuSubContent className="w-40" sideOffset={8}>
									{currentUserRole
										? getLimitedRoleVisibility(currentUserRole).map((role) => {
												const roleMap = {
													REGISTRAR: { label: 'Registrar' },
													DEAN: { label: 'Dean' },
													PROGRAM_CHAIR: { label: 'Program Chair' },
													INSTRUCTOR: { label: 'Instructor' },
													STUDENT: { label: 'Student' }
												}

												if (role === 'DEAN') {
													return (
														<DepartmentFormModal
															key={role}
															onSubmit={(department) =>
																editRole(row.original.id, role, department)
															}
														>
															<DropdownMenuItem
																onSelect={(e) => e.preventDefault()}
															>
																{roleMap[role].label}
															</DropdownMenuItem>
														</DepartmentFormModal>
													)
												}

												return (
													<DropdownMenuItem
														key={role}
														onSelect={() => editRole(row.original.id, role)}
													>
														{roleMap[role].label}
													</DropdownMenuItem>
												)
											})
										: null}
								</DropdownMenuSubContent>
							</DropdownMenuSub>
						</DropdownMenuContent>
					</DropdownMenu>
				)
			}
		}
	]
}
