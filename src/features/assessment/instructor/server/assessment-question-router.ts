import { generateObject } from 'ai'

import { openai } from '@/server/ai'
import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

import { env } from '@/core/env/server'

import {
	addAssessmentQuestionSchema,
	aiResponseSchema,
	editAssessmentQuestionOrderSchema,
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
		.mutation(async ({ ctx, input }) => {
			const { assessmentId, questionType, question, options, points } = input

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
		}),

	// Generate Questions
	generateAiQuestions: instructorProcedure
		.input(generateAiAssessmentQuestionSchema)
		.mutation(async ({ ctx, input }) => {
			const {
				assessmentId,
				chapters,
				questionType,
				numberOfQuestions,
				additionalPrompt
			} = input

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
		}),

	// ---------------------------------------------------------------------------
	// READ
	// ---------------------------------------------------------------------------
	//

	// ---------------------------------------------------------------------------
	// UPDATE
	// ---------------------------------------------------------------------------
	//

	// Edit Assessment Question Order
	editOrder: instructorProcedure
		.input(editAssessmentQuestionOrderSchema)
		.mutation(async ({ ctx, input }) => {
			const { assessmentId, questionList } = input

			for (const question of questionList) {
				const newPosition = question.position + 1

				await ctx.db.assessmentQuestion.update({
					where: { assessmentId, questionId: question.id },
					data: { position: newPosition }
				})
			}

			return { message: 'Assessment questions reordered successfully' }
		})

	// ---------------------------------------------------------------------------
	// DELETE
	// ---------------------------------------------------------------------------
	//
})
