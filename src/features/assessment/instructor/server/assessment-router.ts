import { TRPCClientError } from '@trpc/client'

import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

import {
	addAssessmentSchema,
	deleteAssessmentSchema,
	editAssessmentInstructionSchema,
	editAssessmentOrderSchema,
	editAssessmentTitleSchema,
	editShuffleOptionsSchema,
	editShuffleQuestionsSchema,
	findManyLessonsSchema,
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
		.mutation(async ({ ctx, input: { chapterId, title } }) => {
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
		.query(async ({ ctx, input: { assessmentId } }) => {
			const assessment = await ctx.db.chapterAssessment.findUnique({
				where: { assessmentId },
				include: {
					questions: {
						orderBy: { position: 'asc' }
					},
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

	// Find Many Lessons
	findManyLessons: instructorProcedure
		.input(findManyLessonsSchema)
		.query(async ({ ctx, input: { courseId } }) => {
			const lessons = await ctx.db.chapter.findMany({
				where: { courseId, type: 'LESSON' },
				orderBy: { position: 'asc' }
			})

			return { lessons }
		}),

	// ---------------------------------------------------------------------------
	// UPDATE
	// ---------------------------------------------------------------------------
	//

	// Edit Assessment Title
	editTitle: instructorProcedure
		.input(editAssessmentTitleSchema)
		.mutation(async ({ ctx, input: { assessmentId, title } }) => {
			await ctx.db.chapterAssessment.update({
				where: { assessmentId },
				data: { title }
			})

			return {
				message: 'Assessment title updated successfully',
				newTitle: title
			}
		}),

	// Edit Assessment Instruction
	editInstruction: instructorProcedure
		.input(editAssessmentInstructionSchema)
		.mutation(async ({ ctx, input: { assessmentId, instruction } }) => {
			await ctx.db.chapterAssessment.update({
				where: { assessmentId },
				data: { instruction }
			})

			return {
				message: 'Assessment instruction updated successfully',
				newInstruction: instruction
			}
		}),

	// Edit Assessment Shuffle Questions
	editShuffleQuestions: instructorProcedure
		.input(editShuffleQuestionsSchema)
		.mutation(async ({ ctx, input: { assessmentId, shuffleQuestions } }) => {
			await ctx.db.chapterAssessment.update({
				where: { assessmentId },
				data: { shuffleQuestions }
			})

			return { message: 'Assessment shuffle questions updated successfully' }
		}),

	// Edit Assessment Shuffle Options
	editShuffleOptions: instructorProcedure
		.input(editShuffleOptionsSchema)
		.mutation(async ({ ctx, input: { assessmentId, shuffleOptions } }) => {
			await ctx.db.chapterAssessment.update({
				where: { assessmentId },
				data: { shuffleOptions }
			})

			return { message: 'Assessment shuffle options updated successfully' }
		}),

	// Edit Chapter Assessment Order
	editAssessmentOrder: instructorProcedure
		.input(editAssessmentOrderSchema)
		.mutation(async ({ ctx, input: { chapterId, assessmentList } }) => {
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
		.mutation(async ({ ctx, input: { assessmentId } }) => {
			await ctx.db.chapterAssessment.delete({
				where: { assessmentId }
			})

			return { message: 'Assessment deleted successfully' }
		})
})
