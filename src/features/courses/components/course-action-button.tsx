'use client'

import { useRouter } from 'next/navigation'
import { type Status } from '@prisma/client'
import { toast } from 'sonner'

import { api } from '@/services/trpc/react'

import { ConfirmModal } from '@/core/components/confirm-modal'
import { Button } from '@/core/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/core/components/ui/dropdown-menu'
import { Archive, Delete, DotsHorizontal, Unarchive } from '@/core/lib/icons'

import { type DeleteCourseSchema } from '@/features/courses/validations/course-schema'
import { type EditCourseStatusSchema } from '@/features/courses/validations/course-status-schema'

type CourseActionsProps = DeleteCourseSchema & EditCourseStatusSchema

export const CourseActionButton = ({ id, status }: CourseActionsProps) => {
	const router = useRouter()

	const { mutate: editStatus, isPending: isEditingStatus } = api.course.editStatus.useMutation({
		onSuccess: (data) => {
			toast.success(data.message)
			router.refresh()
		}
	})

	const { mutate: deleteCourse, isPending: isDeletingCourse } = api.course.deleteCourse.useMutation(
		{
			onSuccess: (data) => {
				toast.success(data.message)
				router.push(`/instructor/courses`)
				router.refresh()
			}
		}
	)

	const handleStatusChange = (newStatus: Status) => editStatus({ id, status: newStatus })

	const getStatusButtonLabel = () =>
		isEditingStatus ? 'Loading...' : status === 'PUBLISHED' ? `Unpublish Course` : `Publish Course`

	return (
		<div className="flex items-center gap-2">
			<Button
				size="md"
				disabled={isEditingStatus || isDeletingCourse || status === 'ARCHIVED'}
				variant={isEditingStatus ? 'shine' : 'default'}
				onClick={() => handleStatusChange(status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED')}
			>
				{getStatusButtonLabel()}
			</Button>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						aria-label="Open menu"
						variant="ghost"
						size="md"
						className="size-9 rounded-md"
						disabled={isEditingStatus || isDeletingCourse}
					>
						<DotsHorizontal aria-hidden="true" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-40">
					<DropdownMenuItem
						disabled={isEditingStatus}
						onClick={() => handleStatusChange(status === 'ARCHIVED' ? 'DRAFT' : 'ARCHIVED')}
					>
						{status === 'ARCHIVED' ? (
							<Unarchive className="mr-2 size-4" />
						) : (
							<Archive className="mr-2 size-4" />
						)}
						{status === 'ARCHIVED' ? 'Unarchive' : 'Archive'}
					</DropdownMenuItem>
					<ConfirmModal
						title="Are you sure you want to delete this course?"
						description="This action cannot be undone. This will permanently delete your course and remove your data from our servers."
						onConfirm={() => deleteCourse({ id })}
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
		</div>
	)
}
