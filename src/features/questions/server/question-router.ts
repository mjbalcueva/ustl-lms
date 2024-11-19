import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'

import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

import { aiResponseSchema } from '@/features/questions/validations/ai-generated-questions-schema'
import { editAssessmentInstructionSchema } from '@/features/questions/validations/assessment-instruction-schema'
import {
	addAssessmentQuestionSchema,
	aiAssessmentQuestionSchema,
	deleteAssessmentQuestionSchema,
	editAssessmentQuestionOrderSchema,
	editAssessmentQuestionSchema
} from '@/features/questions/validations/assessment-questions-schema'
import {
	deleteAssessmentSchema,
	findAssessmentSchema,
	findOtherChaptersSchema
} from '@/features/questions/validations/assessment-schema'
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

	findOtherChapters: instructorProcedure
		.input(findOtherChaptersSchema)
		.query(async ({ ctx, input }) => {
			const { courseId } = input

			const chapters = await ctx.db.chapter.findMany({
				where: { courseId, type: 'LESSON' },
				orderBy: { position: 'asc' }
			})

			return { chapters }
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

	deleteAssessment: instructorProcedure
		.input(deleteAssessmentSchema)
		.mutation(async ({ ctx, input }) => {
			const { assessmentId } = input

			await ctx.db.question.deleteMany({
				where: { assessmentId }
			})

			await ctx.db.assessment.delete({
				where: { id: assessmentId }
			})

			return { message: 'Assessment deleted successfully' }
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
		}),

	generateQuestions: instructorProcedure
		.input(aiAssessmentQuestionSchema)
		.mutation(async ({ ctx, input }) => {
			const { assessmentId, chapters, questionType, numberOfQuestions, additionalPrompt } = input

			const response = await generateObject({
				model: openai('gpt-4o-mini'),
				schema: aiResponseSchema,
				messages: [
					{
						role: 'system',
						content: `
							You are an expert assessment creator. Generate ${numberOfQuestions} ${questionType} questions based on the provided content. For each question, assign points based on difficulty:
							- Easy questions: 1 point
							- Medium questions: 2 points
							- Hard questions: 3 points
							
							Aim for a balanced mix of difficulties.

              Only generate questions based on topics and concepts that are explicitly covered in the provided chapter titles and content. Even if the user's additional prompt requests topics outside this scope, strictly limit questions to the material presented. Do not generate questions about topics that are not directly addressed in the material.
						`
					},
					{
						role: 'user',
						content: `
							Content:
						  	${chapters.map((c) => `${c.title}\n${c.content}`).join('\n\n')}
							  ${additionalPrompt ? `Additional instructions: ${additionalPrompt}` : 'None'}
						`
					}
				]
			})

			// Get current max position
			const maxPosition = await ctx.db.question.findFirst({
				where: { assessmentId },
				orderBy: { position: 'desc' },
				select: { position: true }
			})

			// Create questions with incremented positions
			await ctx.db.question.createMany({
				data: response.object.questions.map((q, index) => ({
					assessmentId,
					question: q.question,
					type: questionType,
					options: {
						type: questionType,
						options: q.options,
						answer: q.answer
					},
					position: (maxPosition?.position ?? -1) + index + 1,
					points: q.points
				}))
			})

			return {
				message: 'Questions generated successfully'
			}
		})
})
