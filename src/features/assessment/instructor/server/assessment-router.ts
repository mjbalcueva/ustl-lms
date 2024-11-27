import { TRPCClientError } from '@trpc/client'

import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

import {
	addAssessmentSchema,
	deleteAssessmentSchema,
	editAssessmentOrderSchema,
	editAssessmentTitleSchema,
	editShuffleOptionsSchema,
	editShuffleQuestionsSchema,
	findOneAssessmentSchema
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
	// READ
	// ---------------------------------------------------------------------------
	//

	// Find One Assessment
	findOneAssessment: instructorProcedure
		.input(findOneAssessmentSchema)
		.query(async ({ ctx, input }) => {
			const { assessmentId } = input

			const assessment = await ctx.db.chapterAssessment.findUnique({
				where: { assessmentId },
				include: {
					chapter: {
						select: {
							chapterId: true,
							title: true,
							course: {
								select: { courseId: true, title: true }
							}
						}
					}
				}
			})

			if (!assessment) {
				throw new TRPCClientError('Assessment not found')
			}

			return { assessment }
		}),

	// ---------------------------------------------------------------------------
	// UPDATE
	// ---------------------------------------------------------------------------
	//

	// Edit Assessment Title
	editTitle: instructorProcedure
		.input(editAssessmentTitleSchema)
		.mutation(async ({ ctx, input }) => {
			const { assessmentId, title } = input

			await ctx.db.chapterAssessment.update({
				where: { assessmentId },
				data: { title }
			})

			return {
				message: 'Assessment title updated successfully',
				newTitle: title
			}
		}),

	// Edit Assessment Shuffle Questions
	editShuffleQuestions: instructorProcedure
		.input(editShuffleQuestionsSchema)
		.mutation(async ({ ctx, input }) => {
			const { assessmentId, shuffleQuestions } = input

			await ctx.db.chapterAssessment.update({
				where: { assessmentId },
				data: { shuffleQuestions }
			})

			return { message: 'Assessment shuffle questions updated successfully' }
		}),

	// Edit Assessment Shuffle Options
	editShuffleOptions: instructorProcedure
		.input(editShuffleOptionsSchema)
		.mutation(async ({ ctx, input }) => {
			const { assessmentId, shuffleOptions } = input

			await ctx.db.chapterAssessment.update({
				where: { assessmentId },
				data: { shuffleOptions }
			})

			return { message: 'Assessment shuffle options updated successfully' }
		}),

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
		}),

	// ---------------------------------------------------------------------------
	// DELETE
	// ---------------------------------------------------------------------------
	//

	// Delete Assessment
	deleteAssessment: instructorProcedure
		.input(deleteAssessmentSchema)
		.mutation(async ({ ctx, input }) => {
			const { assessmentId } = input

			await ctx.db.chapterAssessment.delete({
				where: { assessmentId }
			})

			return { message: 'Assessment deleted successfully' }
		})
})
