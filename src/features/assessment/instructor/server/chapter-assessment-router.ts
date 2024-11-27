import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

import {
	addAssessmentSchema,
	editAssessmentOrderSchema
} from '@/features/assessment/shared/validations/assessments-schema'

export const assessmentRouter = createTRPCRouter({
	// ---------------------------------------------------------------------------
	// CREATE
	// ---------------------------------------------------------------------------
	//

	// Add Chapter Assessment
	addAssessment: instructorProcedure
		.input(addAssessmentSchema)
		.mutation(async ({ ctx, input }) => {
			const { chapterId, title } = input

			const lastAssessment = await ctx.db.chapterAssessment.findFirst({
				where: { chapterId },
				orderBy: { position: 'desc' }
			})

			const position = lastAssessment ? lastAssessment.position + 1 : 1

			const assessment = await ctx.db.chapterAssessment.create({
				data: { chapterId, title, position }
			})

			return { message: 'Assessment created successfully', assessment }
		}),

	// ---------------------------------------------------------------------------
	// UPDATE
	// ---------------------------------------------------------------------------
	//

	// Edit Chapter Assessment Order
	editAssessmentOrder: instructorProcedure
		.input(editAssessmentOrderSchema)
		.mutation(async ({ ctx, input }) => {
			const { chapterId, assessmentList } = input

			for (const assessment of assessmentList) {
				const newPosition = assessment.position + 1

				await ctx.db.chapterAssessment.update({
					where: { chapterId, assessmentId: assessment.assessmentId },
					data: { position: newPosition }
				})
			}

			return { message: 'Assessments reordered successfully' }
		})
})
