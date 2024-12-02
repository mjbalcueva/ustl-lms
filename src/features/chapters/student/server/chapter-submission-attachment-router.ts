import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

import { utapi } from '@/services/uploadthing/utapi'

import {
	addSubmissionAttachmentSchema,
	deleteSubmissionAttachmentSchema
} from '@/features/chapters/shared/validations/chapter-submission-attachment-schema'

export const chapterSubmissionAttachmentsRouter = createTRPCRouter({
	// ---------------------------------------------------------------------------
	// CREATE
	// ---------------------------------------------------------------------------
	//

	// Add Chapter Submission Attachment
	addSubmissionAttachment: protectedProcedure
		.input(addSubmissionAttachmentSchema)
		.mutation(async ({ ctx, input }) => {
			const { submissionId, url, name } = input
			const studentId = ctx.session.user.id

			const submission = await ctx.db.assignmentSubmission.findUnique({
				where: { submissionId, studentId }
			})

			if (!submission) {
				throw new Error('Submission not found or unauthorized')
			}

			const attachment = await ctx.db.assignmentSubmissionAttachment.create({
				data: { submissionId, url, name }
			})

			return { message: 'Attachment added!', attachment }
		}),

	// ---------------------------------------------------------------------------
	// DELETE
	// ---------------------------------------------------------------------------
	//

	// Delete Submission Attachment
	deleteSubmissionAttachment: protectedProcedure
		.input(deleteSubmissionAttachmentSchema)
		.mutation(async ({ ctx, input }) => {
			const { attachmentId } = input
			const studentId = ctx.session.user.id

			const attachment = await ctx.db.assignmentSubmissionAttachment.findUnique(
				{
					where: { attachmentId },
					include: { submission: true }
				}
			)

			if (!attachment || attachment.submission.studentId !== studentId) {
				throw new Error('Attachment not found or unauthorized')
			}

			await ctx.db.assignmentSubmissionAttachment.delete({
				where: { attachmentId }
			})

			const attachmentKey = attachment?.url.split('/f/')[1]
			if (attachmentKey) await utapi.deleteFiles(attachmentKey)

			return { message: 'Attachment deleted!', attachment }
		})
})
