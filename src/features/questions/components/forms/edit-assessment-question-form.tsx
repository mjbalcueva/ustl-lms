'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '@/services/trpc/react'

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

import { EditAssessmentQuestionFormFields } from '@/features/questions/components/forms/edit-assessment-question-form-fields'
import {
	editAssessmentQuestionSchema,
	type EditAssessmentQuestionSchema
} from '@/features/questions/validations/assessment-questions-schema'

type EditAssessmentQuestionFormProps = {
	isOpen: boolean
	onClose: () => void
	questionData: EditAssessmentQuestionSchema
	assessmentId: string
}

export const EditAssessmentQuestionForm = ({
	isOpen,
	onClose,
	questionData,
	assessmentId
}: EditAssessmentQuestionFormProps) => {
	const form = useForm<EditAssessmentQuestionSchema>({
		resolver: zodResolver(editAssessmentQuestionSchema),
		defaultValues: {
			...questionData,
			assessmentId
		}
	})

	const { mutate: editQuestion, isPending: isEditing } = api.question.editQuestion.useMutation({
		onSuccess: () => {
			toast.success('Question updated successfully')
			onClose()
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
					<DialogDescription>Update the question details below.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<EditAssessmentQuestionFormFields form={form} isSubmitting={isEditing} />

						<DialogFooter className="gap-2 md:gap-0">
							<DialogClose asChild>
								<Button type="button" variant="outline">
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
