import { TRPCError } from '@trpc/server'

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

import {
	addAssessmentAnswerSchema,
	editAssessmentAnswerSchema,
	submitAssessmentSchema
} from '@/features/assessment/shared/validations/assessment-submission-schema'

export const assessmentRouter = createTRPCRouter({
	// ---------------------------------------------------------------------------
	// CREATE
	// ---------------------------------------------------------------------------
	//

	// Add Assessment Answer
	addAnswer: protectedProcedure
		.input(addAssessmentAnswerSchema)
		.mutation(async ({ ctx, input }) => {
			const question = await ctx.db.assessmentQuestion.findUnique({
				where: { questionId: input.questionId }
			})

			if (!question) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Question not found'
				})
			}

			// Check if answer already exists
			const existingAnswer = await ctx.db.assessmentAnswer.findFirst({
				where: {
					questionId: input.questionId,
					studentId: ctx.session.user.id
				}
			})

			if (existingAnswer) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Answer already exists'
				})
			}

			// Validate answer based on question type
			const options = question.options as {
				type: string
				answer: string | string[]
			}
			const isCorrect = Array.isArray(input.answer)
				? input.answer.every((a) => (options.answer as string[]).includes(a)) &&
					(options.answer as string[]).every((a) => input.answer.includes(a))
				: input.answer === options.answer

			const answer = await ctx.db.assessmentAnswer.create({
				data: {
					questionId: input.questionId,
					studentId: ctx.session.user.id,
					answer: input.answer,
					isCorrect
				}
			})

			return { answer }
		}),

	// Edit Assessment Answer
	editAnswer: protectedProcedure
		.input(editAssessmentAnswerSchema)
		.mutation(async ({ ctx, input }) => {
			const answer = await ctx.db.assessmentAnswer.findUnique({
				where: { answerId: input.answerId },
				include: { question: true }
			})

			if (!answer) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Answer not found'
				})
			}

			if (answer.studentId !== ctx.session.user.id) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'Not authorized'
				})
			}

			// Validate answer based on question type
			const options = answer.question.options as {
				type: string
				answer: string | string[]
			}
			const isCorrect = Array.isArray(input.answer)
				? input.answer.every((a) => (options.answer as string[]).includes(a)) &&
					(options.answer as string[]).every((a) => input.answer.includes(a))
				: input.answer === options.answer

			const updatedAnswer = await ctx.db.assessmentAnswer.update({
				where: { answerId: input.answerId },
				data: {
					answer: input.answer,
					isCorrect
				}
			})

			return { answer: updatedAnswer }
		}),

	// Submit Assessment
	submit: protectedProcedure
		.input(submitAssessmentSchema)
		.mutation(async ({ ctx, input }) => {
			const assessment = await ctx.db.chapterAssessment.findUnique({
				where: { assessmentId: input.assessmentId },
				include: {
					questions: {
						include: {
							answers: {
								where: { studentId: ctx.session.user.id }
							}
						}
					},
					chapter: true
				}
			})

			if (!assessment) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Assessment not found'
				})
			}

			// Create or update answers
			const answers = await Promise.all(
				input.answers.map(async (answer) => {
					const question = assessment.questions.find(
						(q) => q.questionId === answer.questionId
					)

					if (!question) {
						throw new TRPCError({
							code: 'NOT_FOUND',
							message: `Question ${answer.questionId} not found`
						})
					}

					const options = question.options as {
						type: string
						answer: string | string[]
					}
					const isCorrect = Array.isArray(answer.answer)
						? answer.answer.every((a) =>
								(options.answer as string[]).includes(a)
							) &&
							(options.answer as string[]).every((a) =>
								answer.answer.includes(a)
							)
						: answer.answer === options.answer

					return ctx.db.assessmentAnswer.upsert({
						where: {
							questionId_studentId: {
								questionId: answer.questionId,
								studentId: ctx.session.user.id
							}
						},
						create: {
							questionId: answer.questionId,
							studentId: ctx.session.user.id,
							answer: answer.answer,
							isCorrect
						},
						update: {
							answer: answer.answer,
							isCorrect
						}
					})
				})
			)

			// Mark chapter as completed
			await ctx.db.chapterProgress.upsert({
				where: {
					chapterId_studentId: {
						chapterId: assessment.chapter.chapterId,
						studentId: ctx.session.user.id
					}
				},
				create: {
					chapterId: assessment.chapter.chapterId,
					studentId: ctx.session.user.id,
					isCompleted: true
				},
				update: {
					isCompleted: true
				}
			})

			return { answers }
		})
})
