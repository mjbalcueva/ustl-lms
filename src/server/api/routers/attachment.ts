import { UTApi } from 'uploadthing/server'

import { createAttachmentSchema, deleteAttachmentSchema } from '@/shared/validations/attachment'

import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

const utapi = new UTApi()

export const attachmentRouter = createTRPCRouter({
	createAttachment: instructorProcedure.input(createAttachmentSchema).mutation(async ({ ctx, input }) => {
		const { courseId, attachmentUrl } = input

		const courseOwner = await ctx.db.course.findUnique({
			where: { id: courseId, createdById: ctx.session.user.id! }
		})

		if (!courseOwner) throw new Error('Course not found')

		const newAttachment = await ctx.db.attachment.create({
			data: {
				url: attachmentUrl,
				courseId: courseId,
				name: attachmentUrl.split('/').pop() ?? 'Untitled'
			}
		})

		return { message: 'Course attachment updated!', newAttachment }
	}),

	deleteAttachment: instructorProcedure.input(deleteAttachmentSchema).mutation(async ({ ctx, input }) => {
		const { attachmentId } = input

		const attachment = await ctx.db.attachment.delete({
			where: { id: attachmentId, course: { createdById: ctx.session.user.id! } }
		})

		const attachmentKey = attachment?.url.split('/f/')[1]
		if (attachmentKey) await utapi.deleteFiles(attachmentKey)

		return { message: 'Course attachment deleted!', attachment }
	})
})
