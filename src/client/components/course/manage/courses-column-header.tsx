import { type Column } from '@tanstack/react-table'
import { LuArrowDown, LuArrowUp, LuChevronsUpDown } from 'react-icons/lu'
import { RxEyeNone } from 'react-icons/rx'

import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/client/components/ui'
import { cn } from '@/client/lib/utils'

type CoursesColumnHeaderProps<TData, TValue> = React.HTMLAttributes<HTMLDivElement> & {
	column: Column<TData, TValue>
	title: string
}

export const CoursesColumnHeader = <TData, TValue>({
	column,
	title,
	className
}: CoursesColumnHeaderProps<TData, TValue>) => {
	if (!column.getCanSort() && !column.getCanHide()) {
		return <div className={cn(className)}>{title}</div>
	}

	return (
		<div className={cn('flex items-center space-x-2', className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						aria-label={
							column.getIsSorted() === 'desc'
								? 'Sorted descending. Click to sort ascending.'
								: column.getIsSorted() === 'asc'
									? 'Sorted ascending. Click to sort descending.'
									: 'Not sorted. Click to sort ascending.'
						}
						variant="ghost"
						size="sm"
						className="-ml-3 h-8 data-[state=open]:bg-accent"
					>
						<span>{title}</span>
						{column.getCanSort() && column.getIsSorted() === 'desc' ? (
							<LuArrowDown className="ml-2 size-4" aria-hidden="true" />
						) : column.getIsSorted() === 'asc' ? (
							<LuArrowUp className="ml-2 size-4" aria-hidden="true" />
						) : (
							<LuChevronsUpDown className="ml-2 size-4" aria-hidden="true" />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					{column.getCanSort() && (
						<>
							<DropdownMenuItem aria-label="Sort ascending" onClick={() => column.toggleSorting(false)}>
								<LuArrowUp className="mr-2 size-3.5 text-muted-foreground/70" aria-hidden="true" />
								Asc
							</DropdownMenuItem>
							<DropdownMenuItem aria-label="Sort descending" onClick={() => column.toggleSorting(true)}>
								<LuArrowDown className="mr-2 size-3.5 text-muted-foreground/70" aria-hidden="true" />
								Desc
							</DropdownMenuItem>
						</>
					)}
					{column.getCanSort() && column.getCanHide() && <DropdownMenuSeparator />}
					{column.getCanHide() && (
						<DropdownMenuItem aria-label="Hide column" onClick={() => column.toggleVisibility(false)}>
							<RxEyeNone className="mr-2 size-3.5 text-muted-foreground/70" aria-hidden="true" />
							Hide
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
