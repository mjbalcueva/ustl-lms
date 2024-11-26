import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

import { utapi } from '@/services/uploadthing/utapi'

import {
	addCourseAttachmentSchema,
	deleteCourseAttachmentSchema
} from '@/features/courses/shared/validations/course-attachment-schema'

export const courseAttachmentsRouter = createTRPCRouter({
	// ---------------------------------------------------------------------------
	// CREATE
	// ---------------------------------------------------------------------------
	//

	// Add Course Attachment
	addCourseAttachment: instructorProcedure
		.input(addCourseAttachmentSchema)
		.mutation(async ({ ctx, input }) => {
			const { courseId, url, name } = input

			const attachment = await ctx.db.courseAttachment.create({
				data: { courseId, url, name }
			})

			return { message: 'Course attachment created!', attachment }
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
	deleteCourseAttachment: instructorProcedure
		.input(deleteCourseAttachmentSchema)
		.mutation(async ({ ctx, input }) => {
			const { attachmentId } = input
			const instructorId = ctx.session.user.id

			const attachment = await ctx.db.courseAttachment.delete({
				where: {
					attachmentId,
					course: { instructorId }
				}
			})

			const attachmentKey = attachment?.url.split('/f/')[1]
			if (attachmentKey) await utapi.deleteFiles(attachmentKey)

			return { message: 'Course attachment deleted!', attachment }
		})
})
