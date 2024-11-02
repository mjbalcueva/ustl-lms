import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

import { editAssessmentInstructionSchema } from '@/features/questions/validations/assessment-instruction-schema'
import { findAssessmentSchema } from '@/features/questions/validations/assessment-schema'
import {
	editShuffleOptionsSchema,
	editShuffleQuestionsSchema
} from '@/features/questions/validations/assessment-settings-schema'
import { editAssessmentTitleSchema } from '@/features/questions/validations/assessment-title-schema'

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
		}),

	editShuffleQuestions: instructorProcedure
		.input(editShuffleQuestionsSchema)
		.mutation(async ({ ctx, input }) => {
			const { chapterId, assessmentId, shuffleQuestions } = input

			await ctx.db.assessment.update({
				where: { id: assessmentId, chapterId },
				data: { shuffleQuestions }
			})
		}),

	editShuffleOptions: instructorProcedure
		.input(editShuffleOptionsSchema)
		.mutation(async ({ ctx, input }) => {
			const { chapterId, assessmentId, shuffleOptions } = input

			await ctx.db.assessment.update({
				where: { id: assessmentId, chapterId },
				data: { shuffleOptions }
			})
		})
})
