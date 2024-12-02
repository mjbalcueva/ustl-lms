import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

import { editAssignmentSubmissionSchema } from '@/features/chapters/shared/validations/chapter-assignment-submission-schema'

export const chapterSubmissionRouter = createTRPCRouter({
	// -----------------------------------------------------------------------------
	// UPDATE
	// -----------------------------------------------------------------------------
	//

	// Edit Assignment Submission
	editAssignmentSubmission: protectedProcedure
		.input(editAssignmentSubmissionSchema)
		.mutation(async ({ ctx, input: { chapterId, content, attachments } }) => {
			const studentId = ctx.session.user.id

			// First upsert the submission
			const submission = await ctx.db.assignmentSubmission.upsert({
				where: {
					studentId_chapterId: {
						studentId,
						chapterId
					}
				},
				create: {
					content,
					student: { connect: { id: studentId } },
					chapter: { connect: { chapterId } }
				},
				update: {
					content
				},
				include: {
					attachments: true
				}
			})

			// Then handle attachments if they exist
			if (attachments && attachments.length > 0) {
				// Delete existing attachments
				await ctx.db.assignmentSubmissionAttachment.deleteMany({
					where: {
						submissionId: submission.submissionId
					}
				})

				// Create new attachments
				await ctx.db.assignmentSubmissionAttachment.createMany({
					data: attachments.map((attachment) => ({
						submissionId: submission.submissionId,
						url: attachment.url,
						name: attachment.name
					}))
				})
			}

			// Fetch the final submission with attachments
			const updatedSubmission = await ctx.db.assignmentSubmission.findUnique({
				where: {
					submissionId: submission.submissionId
				},
				include: {
					attachments: true
				}
			})

			return {
				submission: updatedSubmission,
				message: 'Submission updated!'
			}
		})
})
