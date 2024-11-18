import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

import { editAssessmentInstructionSchema } from '@/features/questions/validations/assessment-instruction-schema'
import {
	addAssessmentQuestionSchema,
	deleteAssessmentQuestionSchema,
	editAssessmentQuestionOrderSchema,
	editAssessmentQuestionSchema
} from '@/features/questions/validations/assessment-questions-schema'
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
							select: { title: true }
						}
					}
				},
				questions: {
					orderBy: { position: 'asc' }
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
		}),

	addQuestions: instructorProcedure
		.input(addAssessmentQuestionSchema)
		.mutation(async ({ ctx, input }) => {
			const { assessmentId, type, question, options, points } = input

			const lastQuestion = await ctx.db.question.findFirst({
				where: { assessmentId },
				orderBy: { position: 'desc' }
			})

			const newPosition = lastQuestion ? lastQuestion.position + 1 : 1

			await ctx.db.question.create({
				data: {
					assessmentId,
					type,
					question,
					options,
					points,
					position: newPosition
				}
			})

			return { message: 'Question created successfully' }
		}),

	editQuestionOrder: instructorProcedure
		.input(editAssessmentQuestionOrderSchema)
		.mutation(async ({ ctx, input }) => {
			const { assessmentId, questionList } = input

			for (const question of questionList) {
				const newPosition = question.position + 1

				await ctx.db.question.update({
					where: { id: question.id, assessmentId },
					data: { position: newPosition }
				})
			}

			return { message: 'Questions reordered successfully' }
		}),

	editQuestion: instructorProcedure
		.input(editAssessmentQuestionSchema)
		.mutation(async ({ ctx, input }) => {
			const { assessmentId, question, type, options, points, id } = input

			const updatedQuestion = await ctx.db.question.update({
				where: {
					id,
					assessmentId
				},
				data: {
					question,
					type,
					options,
					points
				}
			})

			return {
				message: 'Question updated successfully',
				question: updatedQuestion
			}
		}),

	deleteQuestion: instructorProcedure
		.input(deleteAssessmentQuestionSchema)
		.mutation(async ({ ctx, input }) => {
			const { id } = input

			// Get the question to be deleted to find its position and assessmentId
			const questionToDelete = await ctx.db.question.findUnique({
				where: { id },
				select: { position: true, assessmentId: true }
			})

			if (!questionToDelete) {
				throw new Error('Question not found')
			}

			// Delete the question
			await ctx.db.question.delete({ where: { id } })

			// Update positions of remaining questions
			await ctx.db.question.updateMany({
				where: {
					assessmentId: questionToDelete.assessmentId,
					position: { gt: questionToDelete.position }
				},
				data: {
					position: { decrement: 1 }
				}
			})

			return { message: 'Question deleted successfully' }
		})
})
