import {
	addChapterAttachmentSchema,
	addCourseAttachmentSchema,
	deleteAttachmentSchema,
	deleteChapterAttachmentSchema
} from '@/shared/validations/attachment'

import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'
import { utapi } from '@/server/lib/utapi'

export const attachmentRouter = createTRPCRouter({
	addCourseAttachment: instructorProcedure.input(addCourseAttachmentSchema).mutation(async ({ ctx, input }) => {
		const { courseId, url, name } = input

		const courseOwner = await ctx.db.course.findUnique({
			where: { id: courseId, instructorId: ctx.session.user.id! }
		})
		if (!courseOwner) throw new Error('Course not found')

		await ctx.db.attachment.create({
			data: { courseId, url, name }
		})

		return { message: 'Course attachment created!' }
	}),

	addChapterAttachment: instructorProcedure.input(addChapterAttachmentSchema).mutation(async ({ ctx, input }) => {
		const { courseId, chapterId, url, name } = input

		const chapterOwner = await ctx.db.chapter.findUnique({
			where: { id: chapterId, course: { instructorId: ctx.session.user.id! } }
		})
		if (!chapterOwner) throw new Error('Chapter not found')

		await ctx.db.attachment.create({
			data: { courseId, chapterId, url, name }
		})

		return { message: 'Chapter attachment created!' }
	}),

	deleteCourseAttachment: instructorProcedure.input(deleteAttachmentSchema).mutation(async ({ ctx, input }) => {
		const { attachmentId } = input

		const attachment = await ctx.db.attachment.delete({
			where: { id: attachmentId, course: { instructorId: ctx.session.user.id! } }
		})

		const attachmentKey = attachment?.url.split('/f/')[1]
		if (attachmentKey) await utapi.deleteFiles(attachmentKey)

		return { message: 'Course attachment deleted!', attachment }
	}),

	deleteChapterAttachment: instructorProcedure.input(deleteChapterAttachmentSchema).mutation(async ({ ctx, input }) => {
		const { attachmentId } = input

		const attachment = await ctx.db.attachment.delete({
			where: { id: attachmentId, chapter: { course: { instructorId: ctx.session.user.id! } } }
		})

		const attachmentKey = attachment?.url.split('/f/')[1]
		if (attachmentKey) await utapi.deleteFiles(attachmentKey)

		return { message: 'Chapter attachment deleted!', attachment }
	})
})
