'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api, type RouterOutputs } from '@/services/trpc/react'

import { Button } from '@/core/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/core/components/ui/dialog'
import { Form } from '@/core/components/ui/form'

import {
	editAssessmentQuestionSchema,
	type EditAssessmentQuestionSchema,
	type QuestionOptions
} from '@/features/assessment/shared/validations/assessments-question-schema'

export const EditAssessmentQuestionForm = ({
	isOpen,
	onClose,
	question
}: {
	isOpen: boolean
	onClose: () => void
	question: RouterOutputs['instructor']['assessment']['findOneAssessment']['assessment']['questions'][number]
}) => {
	const router = useRouter()

	const form = useForm<EditAssessmentQuestionSchema>({
		resolver: zodResolver(editAssessmentQuestionSchema),
		defaultValues: {
			questionId: question.questionId,
			question: question.question,
			questionType: question.questionType,
			options: question.options as QuestionOptions,
			points: question.points
		}
	})

	const { mutate: editQuestion, isPending: isEditing } =
		api.instructor.assessmentQuestion.editQuestion.useMutation({
			onSuccess: () => {
				toast.success('Question updated successfully')
				onClose()
				router.refresh()
			},
			onError: (error) => toast.error(error.message)
		})

	const onSubmit = (data: EditAssessmentQuestionSchema) => {
		editQuestion({ ...data })
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Question</DialogTitle>
					<DialogDescription>
						Update the question details below.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						{/* <EditAssessmentQuestionFormFields
							form={form}
							isSubmitting={isEditing}
						/> */}

						<DialogFooter className="gap-2 md:gap-0">
							<DialogClose asChild>
								<Button
									type="button"
									variant="outline"
									onClick={() => form.reset()}
									className="bg-card dark:bg-background dark:hover:bg-accent"
								>
									Cancel
								</Button>
							</DialogClose>
							<Button type="submit" disabled={isEditing}>
								{isEditing ? 'Saving...' : 'Save Changes'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
