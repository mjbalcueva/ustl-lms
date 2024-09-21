import { TRPCError } from '@trpc/server'

import { createChapterSchema, getChapterSchema, reorderChaptersSchema } from '@/shared/validations/chapter'

import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

export const chapterRouter = createTRPCRouter({
	createChapter: instructorProcedure.input(createChapterSchema).mutation(async ({ ctx, input }) => {
		const { courseId, title } = input

		const course = await ctx.db.course.findUnique({
			where: { id: courseId, createdById: ctx.session.user.id! }
		})

		if (!course) {
			throw new TRPCError({ code: 'NOT_FOUND', message: 'Course not found' })
		}

		const lastChapter = await ctx.db.chapter.findFirst({
			where: { courseId },
			orderBy: { position: 'desc' }
		})

		const newPosition = lastChapter ? lastChapter.position + 1 : 1

		const chapter = await ctx.db.chapter.create({
			data: { title, courseId, position: newPosition }
		})

		return {
			chapterId: chapter.id,
			message: 'Chapter created successfully'
		}
	}),

	getChapter: instructorProcedure.input(getChapterSchema).query(async ({ ctx, input }) => {
		const { chapterId } = input

		const chapter = await ctx.db.chapter.findUnique({
			where: { id: chapterId },
			include: { course: true }
		})

		if (!chapter) {
			throw new TRPCError({ code: 'NOT_FOUND', message: 'Chapter not found' })
		}

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
