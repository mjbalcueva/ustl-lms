import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

import {
	addChapterAssessmentSchema,
	editChapterAssessmentOrderSchema
} from '@/features/chapters/shared/validations/chapter-assessments-schema'

export const chapterAssessmentRouter = createTRPCRouter({
	// ---------------------------------------------------------------------------
	// CREATE
	// ---------------------------------------------------------------------------
	//

	// Add Chapter Assessment
	addAssessment: instructorProcedure
		.input(addChapterAssessmentSchema)
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
		.input(editChapterAssessmentOrderSchema)
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
