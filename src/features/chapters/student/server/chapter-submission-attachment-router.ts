import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

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
	addSubmissionAttachment: instructorProcedure
		.input(addSubmissionAttachmentSchema)
		.mutation(async ({ ctx, input }) => {
			const { submissionId, url, name } = input

			const attachment = await ctx.db.assignmentSubmissionAttachment.create({
				data: { submissionId, url, name }
			})

			return { message: 'Chapter attachment created!', attachment }
		}),

	// ---------------------------------------------------------------------------
	// DELETE
	// ---------------------------------------------------------------------------
	//

	// Delete Course Attachment
	deleteSubmissionAttachment: instructorProcedure
		.input(deleteSubmissionAttachmentSchema)
		.mutation(async ({ ctx, input }) => {
			const { attachmentId } = input

			const attachment = await ctx.db.chapterAttachment.delete({
				where: {
					attachmentId
				}
			})

			const attachmentKey = attachment?.url.split('/f/')[1]
			if (attachmentKey) await utapi.deleteFiles(attachmentKey)

			return { message: 'Chapter attachment deleted!', attachment }
		})
})
