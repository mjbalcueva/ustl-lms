'use client'

import { useMemo, useState } from 'react'
import { type Column } from '@tanstack/react-table'

import { type RouterOutputs } from '@/services/trpc/react'

import { Input } from '@/core/components/ui/input'
import { Search } from '@/core/lib/icons'

import {
	FilterPopover,
	ResetFilters
} from '@/features/courses/components/ui/filter-popover'
import { EnrolledCourseCard } from '@/features/courses/student/components/enrolled-course-card'

type Course =
	RouterOutputs['student']['course']['findManyEnrolledCourses']['courses'][number]
type FilterState = {
	search: string
	tags: string[]
	professors: string[]
	statuses: string[]
}

export function EnrolledCourses({ courses }: { courses: Course[] }) {
	const [filters, setFilters] = useState<FilterState>({
		search: '',
		tags: [],
		professors: [],
		statuses: []
	})

	const { options, columns } = useMemo(() => {
		const tags = Array.from(
			new Set(courses.flatMap((course) => course.tags.map((tag) => tag.name)))
		).map((tag) => ({ label: tag, value: tag }))

		const professors = Array.from(
			new Set(
				courses.map((course) => course.instructor.profile?.name ?? 'Unknown')
			)
		).map((name) => ({ label: name, value: name }))

		const statuses = [
			{ label: 'Published', value: 'PUBLISHED' },
			{ label: 'Archived', value: 'ARCHIVED' }
		]

		const createColumn = (id: keyof FilterState) =>
			({
				id,
				getFilterValue: () => filters[id],
				setFilterValue: (values: string[] | undefined) =>
					setFilters((prev) => ({ ...prev, [id]: values ?? [] })),
				getFacetedUniqueValues: () => new Map()
			}) as Column<Course, unknown>

		return {
			options: { tags, professors, statuses },
			columns: {
				tags: createColumn('tags'),
				professors: createColumn('professors'),
				statuses: createColumn('statuses')
			}
		}
	}, [courses, filters])

	const filteredCourses = useMemo(() => {
		const { search, tags, professors, statuses } = filters
		return courses.filter((course) => {
			const searchLower = search.toLowerCase()
			const matchesSearch =
				!search ||
				[
					course.title,
					course.description,
					course.instructor.profile?.name,
					course.code
				].some((text) => text?.toLowerCase().includes(searchLower))

			return (
				matchesSearch &&
				(!tags.length || course.tags.some((t) => tags.includes(t.name))) &&
				(!professors.length ||
					professors.includes(course.instructor.profile?.name ?? '')) &&
				(!statuses.length || statuses.includes(course.status))
			)
		})
	}, [courses, filters])

	const hasActiveFilters = Object.values(filters).some((f) =>
		Array.isArray(f) ? f.length > 0 : Boolean(f)
	)

	const resetFilters = () =>
		setFilters({ search: '', tags: [], professors: [], statuses: [] })

	return (
		<>
			<div className="flex flex-wrap items-center gap-2">
				<div className="relative max-w-sm flex-grow">
					<Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
					<Input
						className="!bg-card pl-9"
						placeholder="Browse Course"
						value={filters.search}
						onChange={(e) =>
							setFilters((prev) => ({ ...prev, search: e.target.value }))
						}
						name="search"
					/>
				</div>
				<FilterPopover
					column={columns.tags}
					title="Tags"
					options={options.tags}
				/>
				<FilterPopover
					column={columns.professors}
					title="Professors"
					options={options.professors}
				/>
				<FilterPopover
					column={columns.statuses}
					title="Status"
					options={options.statuses}
				/>
				<ResetFilters hasFilters={hasActiveFilters} onReset={resetFilters} />
			</div>

			<div className="flex flex-wrap justify-center gap-4 lg:justify-normal">
				{filteredCourses.map((course) => (
					<EnrolledCourseCard key={course.courseId} course={course} />
				))}
				{!filteredCourses.length && (
					<div className="w-full rounded-xl border-2 border-dashed bg-card p-16 text-center text-muted-foreground">
						No courses found.
					</div>
				)}
			</div>
		</>
	)
}
