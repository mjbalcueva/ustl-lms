import { TRPCError } from '@trpc/server'

import { createChapterSchema } from '@/shared/validations/chapter'

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

		const chapter = await ctx.db.chapter.create({
			data: { title, courseId, position: 1 }
		})

		return {
			chapterId: chapter.id,
			message: 'Chapter created successfully'
		}
	})
})
