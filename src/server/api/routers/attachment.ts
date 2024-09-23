import { addCourseAttachmentSchema, deleteAttachmentSchema } from '@/shared/validations/attachment'

import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'
import { utapi } from '@/server/lib/utapi'

export const attachmentRouter = createTRPCRouter({
	addAttachment: instructorProcedure.input(addCourseAttachmentSchema).mutation(async ({ ctx, input }) => {
		const { courseId, url, name } = input

		const courseOwner = await ctx.db.course.findUnique({
			where: { id: courseId, createdById: ctx.session.user.id! }
		})
		if (!courseOwner) throw new Error('Course not found')

		await ctx.db.attachment.create({
			data: { courseId, url, name }
		})

		return { message: 'Course attachment created!' }
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
