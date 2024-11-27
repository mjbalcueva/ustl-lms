import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

import { utapi } from '@/services/uploadthing/utapi'

import {
	addChapterAttachmentSchema,
	deleteChapterAttachmentSchema
} from '@/features/chapters/shared/validations/chapter-attachment-schema'

export const chapterAttachmentsRouter = createTRPCRouter({
	// ---------------------------------------------------------------------------
	// CREATE
	// ---------------------------------------------------------------------------
	//

	// Add Course Attachment
	addChapterAttachment: instructorProcedure
		.input(addChapterAttachmentSchema)
		.mutation(async ({ ctx, input }) => {
			const { chapterId, url, name } = input

			const attachment = await ctx.db.chapterAttachment.create({
				data: { chapterId, url, name }
			})

			return { message: 'Chapter attachment created!', attachment }
		}),

	// ---------------------------------------------------------------------------
	// READ
	// ---------------------------------------------------------------------------
	//

	// ---------------------------------------------------------------------------
	// UPDATE
	// ---------------------------------------------------------------------------
	//

	// ---------------------------------------------------------------------------
	// DELETE
	// ---------------------------------------------------------------------------
	//

	// Delete Course Attachment
	deleteChapterAttachment: instructorProcedure
		.input(deleteChapterAttachmentSchema)
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
