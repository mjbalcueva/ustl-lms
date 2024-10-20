import { type Column } from '@tanstack/react-table'

import { Button } from '@/core/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/core/components/ui/dropdown-menu'
import { ArrowDown, ArrowReset, ArrowUp, ChevronsUpDown, EyeNone } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'

type DataTableColumnHeaderProps<TData, TValue> = React.HTMLAttributes<HTMLDivElement> & {
	column: Column<TData, TValue>
	title: string
}

export const DataTableColumnHeader = <TData, TValue>({
	column,
	title,
	className
}: DataTableColumnHeaderProps<TData, TValue>) => {
	if (!column.getCanSort() && !column.getCanHide()) {
		return <div className={cn(className)}>{title}</div>
	}

	return (
		<div className={cn(className)}>
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
						className="-ml-3 h-8 rounded-lg data-[state=open]:bg-accent"
					>
						{title}
						{column.getCanSort() && column.getIsSorted() === 'desc' ? (
							<ArrowDown className="ml-2 size-4" aria-hidden="true" />
						) : column.getIsSorted() === 'asc' ? (
							<ArrowUp className="ml-2 size-4" aria-hidden="true" />
						) : (
							<ChevronsUpDown className="ml-2 size-4 text-muted-foreground/70" aria-hidden="true" />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					{column.getCanSort() && (
						<>
							<DropdownMenuItem
								aria-label="Sort ascending"
								onClick={() => column.toggleSorting(false)}
							>
								<ArrowUp className="mr-2 size-3.5 text-muted-foreground/70" aria-hidden="true" />
								Asc
							</DropdownMenuItem>
							<DropdownMenuItem
								aria-label="Sort descending"
								onClick={() => column.toggleSorting(true)}
							>
								<ArrowDown className="mr-2 size-3.5 text-muted-foreground/70" aria-hidden="true" />
								Desc
							</DropdownMenuItem>
							{column.getIsSorted() && (
								<DropdownMenuItem aria-label="Reset sorting" onClick={() => column.clearSorting()}>
									<ArrowReset
										className="mr-2 size-3.5 text-muted-foreground/70"
										aria-hidden="true"
									/>
									Reset
								</DropdownMenuItem>
							)}
						</>
					)}
					{column.getCanSort() && column.getCanHide() && <DropdownMenuSeparator />}
					{column.getCanHide() && (
						<DropdownMenuItem
							aria-label="Hide column"
							onClick={() => column.toggleVisibility(false)}
						>
							<EyeNone className="mr-2 size-3.5 text-muted-foreground/70" aria-hidden="true" />
							Hide
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
