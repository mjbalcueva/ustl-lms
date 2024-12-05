import { type RouterOutputs } from '@/services/trpc/react'

import { AssessmentCard } from '@/features/chapters/student/components/assessment/assessment-card'
import { AssessmentCardContent } from '@/features/chapters/student/components/assessment/assessment-card-content'
import { AssessmentCardHeader } from '@/features/chapters/student/components/assessment/assessment-card-header'
import { AssessmentQuestionCard } from '@/features/chapters/student/components/assessment/assessment-question-card'

export const AssessmentList = ({
	assessments
}: {
	assessments: NonNullable<
		RouterOutputs['student']['chapter']['findOneChapter']['chapter']
	>['assessments']
}) => {
	return (
		<>
			{assessments.map((assessment) => (
				<AssessmentCard key={assessment.assessmentId}>
					<AssessmentCardHeader
						title={assessment.title}
						instruction={assessment.instruction ?? ''}
					/>
					<AssessmentCardContent className="space-y-3">
						{assessment.questions.map((question, index) => (
							<AssessmentQuestionCard
								key={question.questionId}
								question={question}
								index={index}
							/>
						))}
					</AssessmentCardContent>
				</AssessmentCard>
			))}
		</>
	)
}
