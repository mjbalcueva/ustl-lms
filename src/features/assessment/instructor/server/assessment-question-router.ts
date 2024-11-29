import { generateObject } from 'ai'

import { openai } from '@/server/ai'
import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

import { env } from '@/core/env/server'

import {
	addAssessmentQuestionSchema,
	aiResponseSchema,
	deleteAssessmentQuestionSchema,
	editAssessmentQuestionOrderSchema,
	editAssessmentQuestionSchema,
	generateAiAssessmentQuestionSchema
} from '@/features/assessment/shared/validations/assessments-question-schema'

export const assessmentQuestionRouter = createTRPCRouter({
	// ---------------------------------------------------------------------------
	// CREATE
	// ---------------------------------------------------------------------------
	//

	// Add Assessment Question
	addQuestion: instructorProcedure
		.input(addAssessmentQuestionSchema)
		.mutation(
			async ({
				ctx,
				input: { assessmentId, questionType, question, options, points }
			}) => {
				const lastQuestion = await ctx.db.assessmentQuestion.findFirst({
					where: { assessmentId },
					orderBy: { position: 'desc' }
				})

				const newPosition = lastQuestion ? lastQuestion.position + 1 : 1

				await ctx.db.assessmentQuestion.create({
					data: {
						assessmentId,
						questionType,
						question,
						options,
						points,
						position: newPosition
					}
				})

				return { message: 'Question created successfully' }
			}
		),

	// Generate Questions
	generateAiQuestions: instructorProcedure
		.input(generateAiAssessmentQuestionSchema)
		.mutation(
			async ({
				ctx,
				input: {
					assessmentId,
					chapters,
					questionType,
					numberOfQuestions,
					additionalPrompt
				}
			}) => {
				const response = await generateObject({
					model: openai(env.MODEL_ID),
					schema: aiResponseSchema,
					messages: [
						{
							role: 'system',
							content: `
							You are an expert assessment creator. Generate ${numberOfQuestions} ${questionType} questions based on the provided content.

							For each question, assign points based on difficulty:
							- Easy questions: 1 point
							- Medium questions: 2 points
							- Hard questions: 3 points

							If the user specifies difficulty preferences in their instructions, prioritize generating questions matching those difficulty levels. Otherwise, aim for a balanced mix of difficulties.

							Only generate questions based on topics and concepts that are explicitly covered in the provided chapter titles and content. Even if the user's additional prompt requests topics outside this scope, strictly limit questions to the material presented. Do not generate questions about topics that are not directly addressed in the material.

							[important] Use the following format for true or false questions to underline the important part of the question:
							<p class="text-node"><u class="underline">important word</u> rest of question</p>
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
				const maxPosition = await ctx.db.assessmentQuestion.findFirst({
					where: { assessmentId },
					orderBy: { position: 'desc' },
					select: { position: true }
				})

				// Create questions with incremented positions
				await ctx.db.assessmentQuestion.createMany({
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
			}
		),

	// ---------------------------------------------------------------------------
	// READ
	// ---------------------------------------------------------------------------
	//

	// ---------------------------------------------------------------------------
	// UPDATE
	// ---------------------------------------------------------------------------
	//

	// Edit Assessment Question
	editQuestion: instructorProcedure
		.input(editAssessmentQuestionSchema)
		.mutation(
			async ({
				ctx,
				input: { questionId, questionType, question, options, points }
			}) => {
				await ctx.db.assessmentQuestion.update({
					where: { questionId },
					data: { questionType, question, options, points }
				})

				return { message: 'Question updated successfully' }
			}
		),

	// Edit Assessment Question Order
	editOrder: instructorProcedure
		.input(editAssessmentQuestionOrderSchema)
		.mutation(async ({ ctx, input: { assessmentId, questionList } }) => {
			for (const question of questionList) {
				const newPosition = question.position + 1

				await ctx.db.assessmentQuestion.update({
					where: { assessmentId, questionId: question.questionId },
					data: { position: newPosition }
				})
			}

			return { message: 'Assessment questions reordered successfully' }
		}),

	// ---------------------------------------------------------------------------
	// DELETE
	// ---------------------------------------------------------------------------
	//

	// Delete Assessment Question
	deleteQuestion: instructorProcedure
		.input(deleteAssessmentQuestionSchema)
		.mutation(async ({ ctx, input: { questionId } }) => {
			const question = await ctx.db.assessmentQuestion.findUnique({
				where: { questionId },
				select: { position: true, assessmentId: true }
			})

			if (!question) throw new Error('Question not found')

			await Promise.all([
				ctx.db.assessmentQuestion.delete({ where: { questionId } }),

				ctx.db.assessmentQuestion.updateMany({
					where: {
						assessmentId: question.assessmentId,
						position: { gt: question.position }
					},
					data: { position: { decrement: 1 } }
				})
			])

			return { message: 'Question deleted successfully' }
		})
})
