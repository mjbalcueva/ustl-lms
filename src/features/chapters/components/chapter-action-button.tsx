'use client'

import { useRouter } from 'next/navigation'
import { ChapterType, type Status } from '@prisma/client'
import { toast } from 'sonner'

import { api } from '@/services/trpc/react'

import { ConfirmModal } from '@/core/components/confirm-modal'
import { Button } from '@/core/components/ui/button'
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
} from '@/core/components/ui/dropdown-menu'
import {
	Archive,
	Assessment,
	Assignment,
	BlankType,
	Delete,
	DotsHorizontal,
	Lesson,
	Unarchive
} from '@/core/lib/icons'
import { capitalize } from '@/core/lib/utils/capitalize'

import { type DeleteChapterSchema } from '@/features/chapters/validations/chapter-schema'
import { type EditChapterStatusSchema } from '@/features/chapters/validations/chapter-status-schema'
import { type EditChapterTypeSchema } from '@/features/chapters/validations/chapter-type-schema'

type ChapterActionsProps = DeleteChapterSchema & EditChapterStatusSchema & EditChapterTypeSchema

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
			router.refresh()
		}
	})

	const { mutate: deleteChapter, isPending: isDeletingChapter } =
		api.chapter.deleteChapter.useMutation({
			onSuccess: (data) => {
				toast.success(data.message)
				router.push(`/instructor/courses/${courseId}`)
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
			ASSESSMENT: <Assessment className="mr-2 size-4" />,
			ASSIGNMENT: <Assignment className="mr-2 size-4" />,
			LESSON: <Lesson className="mr-2 size-4" />
		}
		return iconMap[type] || iconMap.LESSON
	}

	return (
		<div className="flex items-center gap-2">
			<Button
				size="md"
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
						size="md"
						className="size-9 rounded-md"
						disabled={isEditingStatus || isEditingType || isDeletingChapter}
					>
						<DotsHorizontal aria-hidden="true" />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end" className="w-44">
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<BlankType className="mr-2 size-4" />
							Chapter Type
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent className="min-w-44" sideOffset={8}>
							<DropdownMenuRadioGroup value={type}>
								{Object.values(ChapterType).map((chapterType) => (
									<ConfirmModal
										key={chapterType}
										title={`Change chapter type to ${capitalize(chapterType)}?`}
										description="This action will reset all chapter content to blank and change its behavior. Different chapter types have different content structures and functionality."
										onConfirm={() => handleTypeChange(chapterType)}
										actionLabel="Change"
									>
										<DropdownMenuRadioItem value={chapterType} onSelect={(e) => e.preventDefault()}>
											{getChapterTypeIcon(chapterType)}
											{capitalize(chapterType)}
										</DropdownMenuRadioItem>
									</ConfirmModal>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuSubContent>
					</DropdownMenuSub>

					<DropdownMenuItem
						onClick={() => handleStatusChange(status === 'ARCHIVED' ? 'DRAFT' : 'ARCHIVED')}
					>
						{status === 'ARCHIVED' ? (
							<Unarchive className="mr-2 size-4" />
						) : (
							<Archive className="mr-2 size-4" />
						)}
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
							<Delete className="mr-2 size-4 text-destructive" />
							Delete
						</DropdownMenuItem>
					</ConfirmModal>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
