import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

import { findAssessmentSchema } from '@/features/questions/validations/assessment-schema'

export const questionRouter = createTRPCRouter({
	// Instructor
	//

	findAssessment: instructorProcedure.input(findAssessmentSchema).query(async ({ ctx, input }) => {
		const { chapterId, assessmentId } = input

		const assessment = await ctx.db.assessment.findUnique({
			where: { id: assessmentId, chapterId },
			include: {
				chapter: {
					include: {
						course: {
							select: {
								title: true
							}
						}
					}
				}
			}
		})

		return { assessment }
	})
})
