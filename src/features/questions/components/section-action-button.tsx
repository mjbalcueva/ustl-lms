'use client'

import { useRouter } from 'next/navigation'

import { api } from '@/services/trpc/react'

import { Button } from '@/core/components/ui/button'
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
import { Delete, Gear } from '@/core/lib/icons'

type SectionActionsProps = {
	courseId: string
	chapterId: string
	assessmentId: string
	shuffleQuestions: boolean
	shuffleOptions: boolean
}

export const SectionActionButton = ({
	courseId,
	chapterId,
	assessmentId,
	shuffleQuestions,
	shuffleOptions
}: SectionActionsProps) => {
	const router = useRouter()

	const { mutate: editShuffleQuestions, isPending: isEditingShuffleQuestions } =
		api.question.editShuffleQuestions.useMutation({
			onSuccess: () => {
				router.refresh()
			}
		})

	const { mutate: editShuffleOptions, isPending: isEditingShuffleOptions } =
		api.question.editShuffleOptions.useMutation({
			onSuccess: () => {
				router.refresh()
			}
		})

	const { mutate: deleteAssessment, isPending: isDeletingAssessment } =
		api.question.deleteAssessment.useMutation({
			onSuccess: () => {
				router.push(`/instructor/courses/${courseId}/assessment/${chapterId}`)
				router.refresh()
			}
		})

	return (
		<div className="flex items-center gap-2">
			<Sheet>
				<SheetTrigger asChild>
					<Button
						variant="outline"
						size="md"
						className="gap-2 bg-card dark:bg-background dark:hover:bg-accent"
					>
						<Gear />
						Settings
					</Button>
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
										chapterId,
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
										chapterId,
										assessmentId,
										shuffleOptions: checked
									})
								}}
							/>
						</div>
					</div>
				</SheetContent>
			</Sheet>
			<Button
				variant="outline"
				size="md"
				disabled={isDeletingAssessment}
				onClick={() => deleteAssessment({ assessmentId })}
			>
				<Delete />
			</Button>
		</div>
	)
}
