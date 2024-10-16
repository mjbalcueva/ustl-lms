'use client'

import { useRouter } from 'next/navigation'
import { ChapterType, type Status } from '@prisma/client'
import { LuArchive, LuTrash } from 'react-icons/lu'
import { TbArchiveOff, TbDots } from 'react-icons/tb'
import { toast } from 'sonner'

import { api } from '@/shared/trpc/react'
import { type DeleteChapterSchema, type EditStatusSchema, type EditTypeSchema } from '@/shared/validations/chapter'

import { ConfirmModal } from '@/client/components/confirm-modal'
import { Icons } from '@/client/components/icons'
import { Button } from '@/client/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from '@/client/components/ui/dropdown-menu'
import { capitalize } from '@/client/lib/utils'

type ChapterActionsProps = DeleteChapterSchema & EditStatusSchema & EditTypeSchema

export const ChapterActions = ({ id, courseId, status, type }: ChapterActionsProps) => {
	const router = useRouter()

	const { mutate: editStatus, isPending: isEditingStatus } = api.chapter.editStatus.useMutation({
		onSuccess: (data) => {
			toast.success(data.message)
			router.refresh()
		}
	})

	const { mutate: editType, isPending: isEditingType } = api.chapter.editType.useMutation({
		onSuccess: (data) => {
			toast.success(data.message)
			toast.info('Refresh the page to see the changes')
			toast.error('Failed to update chapter type')
			toast.warning('Refresh the page to see the changes')
			router.refresh()
		}
	})

	const { mutate: deleteChapter, isPending: isDeletingChapter } = api.chapter.deleteChapter.useMutation({
		onSuccess: (data) => {
			toast.success(data.message)
			router.push(`/courses/${courseId}/edit`)
			router.refresh()
		}
	})

	const handleStatusChange = (newStatus: Status) => editStatus({ id, courseId, status: newStatus })

	const getStatusButtonLabel = () =>
		isEditingStatus
			? 'Loading...'
			: status === 'PUBLISHED'
				? `Unpublish ${capitalize(type)}`
				: `Publish ${capitalize(type)}`

	const handleTypeChange = (newType: ChapterType) => editType({ id, courseId, type: newType })

	const getChapterTypeIcon = (type: ChapterType) => {
		const iconMap = {
			ASSESSMENT: <Icons.ASSESSMENT className="mr-2 size-4" />,
			ASSIGNMENT: <Icons.ASSIGNMENT className="mr-2 size-4" />,
			LESSON: <Icons.LESSON className="mr-2 size-4" />
		}
		return iconMap[type] || iconMap.LESSON
	}

	return (
		<div className="flex items-center gap-2">
			<Button
				size="sm"
				disabled={isEditingStatus || isEditingType || isDeletingChapter || status === 'ARCHIVED'}
				variant={isEditingStatus || isEditingType || isDeletingChapter ? 'shine' : 'default'}
				onClick={() => handleStatusChange(status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED')}
			>
				{getStatusButtonLabel()}
			</Button>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						aria-label="Open menu"
						variant="ghost"
						className="size-9 rounded-md p-0"
						disabled={isEditingStatus || isEditingType || isDeletingChapter}
					>
						<TbDots className="size-4" aria-hidden="true" />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end" className="w-40">
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							{getChapterTypeIcon(type)}
							{capitalize(type)}
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent className="min-w-40" sideOffset={8}>
							<DropdownMenuRadioGroup value={type} onValueChange={(value) => handleTypeChange(value as ChapterType)}>
								{Object.values(ChapterType).map((type) => (
									<DropdownMenuRadioItem key={type} value={type}>
										{capitalize(type)}
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuSubContent>
					</DropdownMenuSub>

					<DropdownMenuItem onClick={() => handleStatusChange(status === 'ARCHIVED' ? 'DRAFT' : 'ARCHIVED')}>
						{status === 'ARCHIVED' ? <TbArchiveOff className="mr-2 size-4" /> : <LuArchive className="mr-2 size-4" />}
						{status === 'ARCHIVED' ? 'Unarchive' : 'Archive'}
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<ConfirmModal
						title="Are you sure you want to delete this chapter?"
						description="This action cannot be undone. This will permanently delete your chapter and remove your data from our servers."
						onConfirm={() => deleteChapter({ id })}
						actionLabel="Delete"
						variant="destructive"
					>
						<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
							<LuTrash className="mr-2 size-4 text-destructive" />
							Delete
						</DropdownMenuItem>
					</ConfirmModal>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
