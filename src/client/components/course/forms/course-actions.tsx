'use client'

import { useRouter } from 'next/navigation'
import { LuArchive, LuTrash } from 'react-icons/lu'
import { TbDots } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { type DeleteCourseSchema, type EditStatusSchema } from '@/shared/validations/course'

import { ConfirmModal } from '@/client/components/confirm-modal'
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/client/components/ui'

type CourseActionsProps = DeleteCourseSchema & EditStatusSchema

export const CourseActions = ({ id, status }: CourseActionsProps) => {
	const router = useRouter()

	const { mutate: editStatus, isPending: isEditingStatus } = api.course.editStatus.useMutation({
		onSuccess: (data) => {
			toast.success(data.message)
			router.refresh()
		}
	})

	const { mutate: deleteCourse } = api.course.deleteCourse.useMutation({
		onSuccess: (data) => {
			toast.success(data.message)
			router.push(`/courses/manage`)
			router.refresh()
		}
	})

	const isPublished = status === 'PUBLISHED'

	return (
		<div className="flex items-center gap-2">
			<Button
				size="sm"
				disabled={isEditingStatus}
				variant={isEditingStatus ? 'shine' : 'default'}
				onClick={() => editStatus({ id, status: isPublished ? 'DRAFT' : 'PUBLISHED' })}
			>
				{isPublished
					? isEditingStatus
						? 'Unpublishing...'
						: 'Unpublish Course'
					: isEditingStatus
						? 'Publishing...'
						: 'Publish Course'}
			</Button>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button aria-label="Open menu" variant="secondary" className="size-9 rounded-md p-0">
						<TbDots className="size-4" aria-hidden="true" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-40">
					<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
						<LuArchive className="mr-2 size-4" />
						Archive
					</DropdownMenuItem>
					<ConfirmModal
						title="Are you sure you want to delete this course?"
						description="This action cannot be undone. This will permanently delete your course and remove your data from our servers."
						onConfirm={() => deleteCourse({ id })}
					>
						<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
							<LuTrash className="mr-2 size-4" />
							Delete
						</DropdownMenuItem>
					</ConfirmModal>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
