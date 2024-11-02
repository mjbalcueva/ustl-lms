import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

import { findAssessmentSchema } from '@/features/questions/validations/assessment-schema'
import { editAssessmentTitleSchema } from '@/features/questions/validations/assessment-title-schema'

import { editAssessmentInstructionSchema } from '../validations/assessment-instruction-schema'

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
	}),

	editAssessmentTitle: instructorProcedure
		.input(editAssessmentTitleSchema)
		.mutation(async ({ ctx, input }) => {
			const { chapterId, assessmentId, title } = input

			const { title: newTitle } = await ctx.db.assessment.update({
				where: { id: assessmentId, chapterId },
				data: { title }
			})

			return {
				message: 'Section title updated successfully',
				newTitle
			}
		}),

	editAssessmentInstruction: instructorProcedure
		.input(editAssessmentInstructionSchema)
		.mutation(async ({ ctx, input }) => {
			const { chapterId, assessmentId, instruction } = input

			const { instruction: newInstruction } = await ctx.db.assessment.update({
				where: { id: assessmentId, chapterId },
				data: { instruction }
			})

			return {
				message: 'Section instruction updated successfully',
				newInstruction
			}
		})
})
