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
		.mutation(async ({ ctx, input: { chapterId, content } }) => {
			const studentId = ctx.session.user.id

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
				}
			})

			return {
				submission,
				message: 'Assignment submitted.'
			}
		})
})
