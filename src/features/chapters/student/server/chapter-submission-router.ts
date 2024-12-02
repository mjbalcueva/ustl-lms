import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

import {
	addSubmissionContentSchema,
	editSubmissionContentSchema,
	findOneSubmissionSchema
} from '@/features/chapters/shared/validations/chapter-submission-schema'

export const chapterSubmissionRouter = createTRPCRouter({
	// -----------------------------------------------------------------------------
	// CREATE
	// -----------------------------------------------------------------------------
	//

	// Add Chapter Assignment Submission Content
	addSubmissionContent: protectedProcedure
		.input(addSubmissionContentSchema)
		.mutation(async ({ ctx, input: { chapterId, content, attachments } }) => {
			const studentId = ctx.session.user.id

			const newContent = await ctx.db.assignmentSubmission.create({
				data: {
					content,
					student: { connect: { id: studentId } },
					chapter: { connect: { chapterId } },
					attachments: {
						createMany: {
							data:
								attachments?.map(({ name, url }) => ({
									name,
									url
								})) ?? []
						}
					}
				},
				include: {
					attachments: true
				}
			})

			return {
				newContent,
				message: 'Submission created!'
			}
		}),

	// -----------------------------------------------------------------------------
	// READ
	// -----------------------------------------------------------------------------
	//

	// Find One Chapter Assignment Submission
	findOneSubmission: protectedProcedure
		.input(findOneSubmissionSchema)
		.query(async ({ ctx, input: { chapterId } }) => {
			const studentId = ctx.session.user.id

			const submission = await ctx.db.assignmentSubmission.findUnique({
				where: { studentId_chapterId: { studentId, chapterId } },
				include: { attachments: true }
			})

			return { submission }
		}),

	// -----------------------------------------------------------------------------
	// UPDATE
	// -----------------------------------------------------------------------------
	//

	// Edit Chapter Assignment Submission Content
	editSubmissionContent: protectedProcedure
		.input(editSubmissionContentSchema)
		.mutation(
			async ({ ctx, input: { submissionId, content, attachments } }) => {
				const studentId = ctx.session.user.id

				// Delete existing attachments if new ones are provided
				if (attachments) {
					await ctx.db.assignmentSubmissionAttachment.deleteMany({
						where: { submissionId }
					})
				}

				const updatedContent = await ctx.db.assignmentSubmission.update({
					where: { submissionId, studentId },
					data: {
						content,
						...(attachments && {
							attachments: {
								createMany: {
									data: attachments.map(({ name, url }) => ({
										name,
										url
									}))
								}
							}
						})
					},
					include: {
						attachments: true
					}
				})

				return {
					updatedContent,
					message: 'Submission updated!'
				}
			}
		)
})
