'use client'

import { useMemo, useState } from 'react'
import { type Column } from '@tanstack/react-table'

import { Input } from '@/core/components/ui/input'
import { Search } from '@/core/lib/icons'

import { CourseCard } from '@/features/courses/components/course-card'
import { FilterPopover } from '@/features/courses/components/ui/filter-popover'

type Course = {
	id: string
	title: string
	description: string | null
	imageUrl: string | null
	code: string
	status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
	instructor: string
	tags: string[]
}

type EnrolledCoursesProps = {
	courses: Course[]
}

export function EnrolledCourses({ courses }: EnrolledCoursesProps) {
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [selectedProfessors, setSelectedProfessors] = useState<string[]>([])
	const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

	const allTags = useMemo(
		() =>
			Array.from(new Set(courses.flatMap((course) => course.tags))).map((tag) => ({
				label: tag,
				value: tag
			})),
		[courses]
	)

	const allProfessors = useMemo(
		() =>
			Array.from(new Set(courses.map((course) => course.instructor))).map((instructor) => ({
				label: instructor,
				value: instructor
			})),
		[courses]
	)

	const allStatuses = useMemo(
		() => [
			{ label: 'Published', value: 'PUBLISHED' },
			{ label: 'Archived', value: 'ARCHIVED' }
		],
		[]
	)

	const filteredCourses = useMemo(
		() =>
			courses.filter((course) => {
				const matchesSearch =
					course.title.toLowerCase().includes(searchQuery.toLowerCase()) ??
					course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
					course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
				const matchesTags =
					selectedTags.length === 0 || selectedTags.some((tag) => course.tags.includes(tag))
				const matchesProfessors =
					selectedProfessors.length === 0 || selectedProfessors.includes(course.instructor)
				const matchesStatus =
					selectedStatuses.length === 0 || selectedStatuses.includes(course.status)
				return matchesSearch && matchesTags && matchesProfessors && matchesStatus
			}),
		[courses, searchQuery, selectedTags, selectedProfessors, selectedStatuses]
	)

	const handleTagFilter = (values: string[] | undefined) => {
		setSelectedTags(values ?? [])
	}

	const handleProfessorFilter = (values: string[] | undefined) => {
		setSelectedProfessors(values ?? [])
	}

	const handleStatusFilter = (values: string[] | undefined) => {
		setSelectedStatuses(values ?? [])
	}

	const tagColumn = {
		id: 'tags',
		getFilterValue: () => selectedTags,
		setFilterValue: handleTagFilter,
		getFacetedUniqueValues: () => new Map()
	} as Column<Course, unknown>

	const professorColumn = {
		id: 'instructor',
		getFilterValue: () => selectedProfessors,
		setFilterValue: handleProfessorFilter,
		getFacetedUniqueValues: () => new Map()
	} as Column<Course, unknown>

	const statusColumn = {
		id: 'status',
		getFilterValue: () => selectedStatuses,
		setFilterValue: handleStatusFilter,
		getFacetedUniqueValues: () => new Map()
	} as Column<Course, unknown>

	return (
		<>
			<div className="flex flex-wrap gap-2">
				<div className="relative max-w-sm flex-grow">
					<Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
					<Input
						className="!bg-card pl-9"
						placeholder="Browse Course"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						name="search"
					/>
				</div>
				<FilterPopover column={tagColumn} title="Tags" options={allTags} />
				<FilterPopover column={professorColumn} title="Professors" options={allProfessors} />
				<FilterPopover column={statusColumn} title="Status" options={allStatuses} />
			</div>

			<div className="flex flex-wrap gap-4">
				{filteredCourses.map((course) => (
					<CourseCard key={course.id} {...course} />
				))}
				{filteredCourses.length === 0 && (
					<div className="w-full rounded-xl border-2 border-dashed bg-card p-16 text-center text-muted-foreground">
						No courses found.
					</div>
				)}
			</div>
		</>
	)
}
