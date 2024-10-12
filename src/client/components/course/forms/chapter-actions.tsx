'use client'

import { useRouter } from 'next/navigation'
import { LuArchive, LuTrash } from 'react-icons/lu'
import { TbDots } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { type DeleteChapterSchema, type EditStatusSchema } from '@/shared/validations/chapter'

import { ConfirmModal } from '@/client/components/confirm-modal'
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/client/components/ui'

type ChapterActionsProps = DeleteChapterSchema & EditStatusSchema

export const ChapterActions = ({ id, courseId, status }: ChapterActionsProps) => {
	const router = useRouter()

	const { mutate: editStatus, isPending: isEditingStatus } = api.chapter.editStatus.useMutation({
		onSuccess: (data) => {
			toast.success(data.message)
			router.refresh()
		}
	})

	const { mutate: deleteChapter } = api.chapter.deleteChapter.useMutation({
		onSuccess: (data) => {
			toast.success(data.message)
			router.push(`/courses/${courseId}/edit`)
			router.refresh()
		}
	})

	return (
		<div className="flex items-center gap-2">
			<Button
				size="sm"
				disabled={isEditingStatus}
				variant={isEditingStatus ? 'shine' : 'default'}
				onClick={() => editStatus({ id, courseId, status: status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' })}
			>
				{status === 'PUBLISHED'
					? isEditingStatus
						? 'Unpublishing...'
						: 'Unpublish Topic'
					: isEditingStatus
						? 'Publishing...'
						: 'Publish Topic'}
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
						title="Are you sure you want to delete this chapter?"
						description="This action cannot be undone. This will permanently delete your chapter and remove your data from our servers."
						onConfirm={() => deleteChapter({ id })}
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
