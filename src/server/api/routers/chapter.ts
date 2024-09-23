import { TRPCError } from '@trpc/server'

import {
	createChapterSchema,
	editChapterTitleSchema,
	getChapterSchema,
	reorderChaptersSchema
} from '@/shared/validations/chapter'

import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

export const chapterRouter = createTRPCRouter({
	addChapter: instructorProcedure.input(createChapterSchema).mutation(async ({ ctx, input }) => {
		const { courseId, title } = input

		const course = await ctx.db.course.findUnique({
			where: { id: courseId, createdById: ctx.session.user.id! }
		})
		if (!course) throw new TRPCError({ code: 'NOT_FOUND', message: 'Course not found' })

		const lastChapter = await ctx.db.chapter.findFirst({
			where: { courseId },
			orderBy: { position: 'desc' }
		})

		const newPosition = lastChapter ? lastChapter.position + 1 : 1

		await ctx.db.chapter.create({
			data: { title, courseId, position: newPosition }
		})

		return { message: 'Chapter created successfully' }
	}),

	editTitle: instructorProcedure.input(editChapterTitleSchema).mutation(async ({ ctx, input }) => {
		const { chapterId, title: title } = input

		const chapter = await ctx.db.chapter.update({
			where: { id: chapterId },
			data: { title }
		})

		return {
			newTitle: chapter.title,
			message: 'Chapter title updated successfully'
		}
	}),

	getChapter: instructorProcedure.input(getChapterSchema).query(async ({ ctx, input }) => {
		const { chapterId } = input

		const chapter = await ctx.db.chapter.findUnique({
			where: { id: chapterId },
			include: { course: true, muxData: true }
		})

		return { chapter }
	}),

	reorderChapters: instructorProcedure.input(reorderChaptersSchema).mutation(async ({ ctx, input }) => {
		const { courseId, chapterList } = input

		for (const chapter of chapterList) {
			const newPosition = chapter.position + 1

			await ctx.db.chapter.update({
				where: { id: chapter.id, courseId },
				data: { position: newPosition }
			})
		}

		return { message: 'Chapters reordered successfully' }
	})
})
