'use client'

import * as React from 'react'
import { Status } from '@prisma/client'

import { type RouterOutputs } from '@/shared/trpc/react'
import { type CoursesFilterField } from '@/shared/types/courses'

import { getColumns } from '@/client/components/course/manage/courses-columns'
import { DataTable } from '@/client/components/data-table/data-table'
import { DataTableToolbar } from '@/client/components/data-table/data-table-toolbar'
import { useDataTable } from '@/client/lib/hooks/use-data-table'

type Course = RouterOutputs['instructor']['getCourses'][number]

type CoursesTableProps = {
	courses: Course[]
}

export const CoursesTable = ({ courses }: CoursesTableProps) => {
	const columns = React.useMemo(() => getColumns(), [])

	const filterFields: CoursesFilterField<Course>[] = [
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

	const { table } = useDataTable({
		data: courses,
		columns,
		filterFields,
		initialState: {
			sorting: [{ id: 'createdAt', desc: true }],
			columnPinning: { right: ['actions'] }
		},
		getRowId: (originalRow) => originalRow.id
	})

	return (
		<DataTable table={table}>
			<DataTableToolbar table={table} filterFields={filterFields} />
		</DataTable>
	)
}
