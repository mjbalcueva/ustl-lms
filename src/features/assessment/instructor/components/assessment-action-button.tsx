'use client'

import { useRouter } from 'next/navigation'

import { api, type RouterOutputs } from '@/services/trpc/react'

import { ConfirmModal } from '@/core/components/confirm-modal'
import { Button } from '@/core/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/core/components/ui/dropdown-menu'
import { Separator } from '@/core/components/ui/separator'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/core/components/ui/sheet'
import { Switch } from '@/core/components/ui/switch'
import { Delete, DotsHorizontal, Gear } from '@/core/lib/icons'

export const AssessmentActionButton = ({
	assessmentId,
	chapterId,
	courseId,
	shuffleQuestions,
	shuffleOptions
}: {
	assessmentId: RouterOutputs['instructor']['assessment']['findOneAssessment']['assessment']['assessmentId']
	chapterId: RouterOutputs['instructor']['assessment']['findOneAssessment']['assessment']['chapter']['chapterId']
	courseId: RouterOutputs['instructor']['assessment']['findOneAssessment']['assessment']['chapter']['course']['courseId']
	shuffleQuestions: RouterOutputs['instructor']['assessment']['findOneAssessment']['assessment']['shuffleQuestions']
	shuffleOptions: RouterOutputs['instructor']['assessment']['findOneAssessment']['assessment']['shuffleOptions']
}) => {
	const router = useRouter()

	const { mutate: editShuffleQuestions, isPending: isEditingShuffleQuestions } =
		api.instructor.assessment.editShuffleQuestions.useMutation({
			onSuccess: () => {
				router.refresh()
			}
		})

	const { mutate: editShuffleOptions, isPending: isEditingShuffleOptions } =
		api.instructor.assessment.editShuffleOptions.useMutation({
			onSuccess: () => {
				router.refresh()
			}
		})

	const { mutate: deleteAssessment, isPending: isDeletingAssessment } =
		api.instructor.assessment.deleteAssessment.useMutation({
			onSuccess: () => {
				router.push(`/instructor/courses/${courseId}/assessment/${chapterId}`)
				router.refresh()
			}
		})

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					aria-label="Open menu"
					variant="ghost"
					size="md"
					className="size-9 rounded-md"
					disabled={
						isEditingShuffleQuestions ||
						isEditingShuffleOptions ||
						isDeletingAssessment
					}
				>
					<DotsHorizontal aria-hidden="true" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-44">
				<Sheet>
					<SheetTrigger asChild>
						<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
							<Gear className="mr-2 size-4" />
							Settings
						</DropdownMenuItem>
					</SheetTrigger>

					<SheetContent>
						<SheetHeader>
							<SheetTitle>Question Settings</SheetTitle>
							<SheetDescription>
								Configure global settings for your assessment questions.
							</SheetDescription>
						</SheetHeader>

						<Separator className="mb-4 mt-3" />

						<div className="space-y-3">
							<div className="flex items-center justify-between rounded-lg border bg-card px-3.5 py-2.5">
								<div className="space-y-1">
									<p className="text-sm font-medium">Shuffle Questions</p>
									<p className="text-sm text-muted-foreground">
										Randomize the order of questions for each student
									</p>
								</div>

								<Switch
									disabled={isEditingShuffleQuestions}
									checked={shuffleQuestions}
									onCheckedChange={(checked: boolean) => {
										editShuffleQuestions({
											assessmentId,
											shuffleQuestions: checked
										})
									}}
								/>
							</div>

							<div className="flex items-center justify-between rounded-lg border bg-card px-3.5 py-2.5">
								<div className="space-y-1">
									<p className="text-sm font-medium">Shuffle Options</p>
									<p className="text-sm text-muted-foreground">
										Randomize the order of answer options for each question
									</p>
								</div>

								<Switch
									disabled={isEditingShuffleOptions}
									checked={shuffleOptions}
									onCheckedChange={(checked: boolean) => {
										editShuffleOptions({
											assessmentId,
											shuffleOptions: checked
										})
									}}
								/>
							</div>
						</div>
					</SheetContent>
				</Sheet>

				<ConfirmModal
					title="Are you sure you want to delete this assessment?"
					description="This action cannot be undone. This will permanently delete your assessment and remove your data from our servers."
					onConfirm={() => deleteAssessment({ assessmentId })}
					actionLabel="Delete"
					variant="destructive"
				>
					<DropdownMenuItem
						onSelect={(e) => e.preventDefault()}
						disabled={isDeletingAssessment}
					>
						<Delete className="mr-2 size-4 text-destructive" />
						Delete
					</DropdownMenuItem>
				</ConfirmModal>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
