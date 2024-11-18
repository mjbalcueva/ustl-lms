'use client'

import { type UseFormReturn } from 'react-hook-form'

import { Button } from '@/core/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/core/components/ui/dialog'
import { Form } from '@/core/components/ui/form'
import { Add } from '@/core/lib/icons'

import { AddAssessmentQuestionFormFields } from '@/features/questions/components/forms/add-assessment-question-form-fields'
import { type AddAssessmentQuestionSchema } from '@/features/questions/validations/assessment-questions-schema'

type AddAssessmentQuestionsFormProps = {
	form: UseFormReturn<AddAssessmentQuestionSchema>
	addQuestion: (data: AddAssessmentQuestionSchema) => void
	isAdding: boolean
}

export const AddAssessmentQuestionForm = ({
	form,
	addQuestion,
	isAdding
}: AddAssessmentQuestionsFormProps) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" size="sm">
					<Add /> Add
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Questions Details</DialogTitle>
					<DialogDescription>Create questions for your assessment section.</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit((data) => addQuestion(data))} className="space-y-4">
						<AddAssessmentQuestionFormFields form={form} isSubmitting={isAdding} />

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
							<Button type="submit" disabled={isAdding} variant={isAdding ? 'shine' : 'default'}>
								{isAdding ? 'Adding...' : 'Add Question'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
