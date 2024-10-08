import {
	addCourseSchema,
	deleteCourseSchema,
	editCodeSchema,
	editDescriptionSchema,
	editImageSchema,
	editStatusSchema,
	editTitleSchema,
	getCourseSchema
} from '@/shared/validations/course'

import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'
import { video } from '@/server/lib/mux'
import { utapi } from '@/server/lib/utapi'

export const courseRouter = createTRPCRouter({
	addCourse: instructorProcedure.input(addCourseSchema).mutation(async ({ ctx, input }) => {
		const { code, title } = input

		const { id: newCourseId } = await ctx.db.course.create({
			data: {
				code,
				title,
				createdById: ctx.session.user.id!
			}
		})

		return { message: 'Course created!', newCourseId }
	}),

	deleteCourse: instructorProcedure.input(deleteCourseSchema).mutation(async ({ ctx, input }) => {
		const { id } = input

		const course = await ctx.db.course.findUnique({
			where: { id, createdById: ctx.session.user.id! },
			include: { chapter: true }
		})

		for (const chapter of course?.chapter ?? []) {
			const oldVideoKey = chapter?.videoUrl?.split('/f/')[1]
			if (oldVideoKey) await utapi.deleteFiles(oldVideoKey)

			const existingMuxData = await ctx.db.muxData.findFirst({
				where: { chapterId: chapter.id }
			})

			if (existingMuxData) {
				await video.assets.delete(existingMuxData.assetId)
				await ctx.db.muxData.delete({
					where: { id: existingMuxData.id }
				})
			}

			const attachments = await ctx.db.attachment.findMany({
				where: { chapterId: chapter.id }
			})

			for (const attachment of attachments) {
				const attachmentKey = attachment.url.split('/f/')[1]
				if (attachmentKey) await utapi.deleteFiles(attachmentKey)
			}
		}

		const oldImageKey = course?.imageUrl?.split('/f/')[1]
		if (oldImageKey) await utapi.deleteFiles(oldImageKey)

		await ctx.db.course.delete({ where: { id, createdById: ctx.session.user.id! } })

		return { message: 'Course deleted!' }
	}),

	editCode: instructorProcedure.input(editCodeSchema).mutation(async ({ ctx, input }) => {
		const { id, code } = input

		const { code: newCode } = await ctx.db.course.update({
			where: { id, createdById: ctx.session.user.id! },
			data: { code }
		})

		return { message: 'Course code updated!', newCode }
	}),

	editTitle: instructorProcedure.input(editTitleSchema).mutation(async ({ ctx, input }) => {
		const { id, title } = input

		const { title: newTitle } = await ctx.db.course.update({
			where: { id, createdById: ctx.session.user.id! },
			data: { title }
		})

		return { message: 'Course title updated!', newTitle }
	}),

	editDescription: instructorProcedure.input(editDescriptionSchema).mutation(async ({ ctx, input }) => {
		const { id: courseId, description } = input

		const { description: newDescription } = await ctx.db.course.update({
			where: { id: courseId, createdById: ctx.session.user.id! },
			data: { description }
		})

		return { message: 'Course description updated!', newDescription }
	}),

	editImage: instructorProcedure.input(editImageSchema).mutation(async ({ ctx, input }) => {
		const { id, imageUrl } = input

		const course = await ctx.db.course.findUnique({
			where: { id, createdById: ctx.session.user.id! },
			select: { imageUrl: true }
		})

		const oldImageKey = course?.imageUrl?.split('/f/')[1]
		if (oldImageKey) await utapi.deleteFiles(oldImageKey)

		await ctx.db.course.update({
			where: { id: id, createdById: ctx.session.user.id! },
			data: { imageUrl }
		})

		return { message: 'Course image updated!' }
	}),

	editStatus: instructorProcedure.input(editStatusSchema).mutation(async ({ ctx, input }) => {
		const { id, status } = input

		await ctx.db.course.update({
			where: { id, createdById: ctx.session.user.id! },
			data: { status }
		})

		return { message: 'Course status updated!' }
	}),

	getCourse: instructorProcedure.input(getCourseSchema).query(async ({ ctx, input }) => {
		const { courseId } = input

		const course = await ctx.db.course.findUnique({
			where: { id: courseId, createdById: ctx.session.user.id! },
			include: {
				attachment: {
					where: { chapterId: null },
					orderBy: { createdAt: 'desc' }
				},
				chapter: { orderBy: { position: 'asc' } }
			}
		})

		return { course }
	})
})
