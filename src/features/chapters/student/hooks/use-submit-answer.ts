import { toast } from 'sonner'

import { api } from '@/services/trpc/react'

import { type SubmitAssessmentAnswers } from '@/features/assessment/shared/validations/student-answer-schema'

export function useSubmitAssessment() {
	const submitAssessment = api.student.assessment.submitAnswers.useMutation({
		onSuccess: () => {
			toast.success('Assessment submitted successfully')
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	const handleSubmitAssessment = async (data: SubmitAssessmentAnswers) => {
		await submitAssessment.mutateAsync(data)
	}

	return {
		handleSubmitAssessment,
		isSubmitting: submitAssessment.isPending
	}
}
