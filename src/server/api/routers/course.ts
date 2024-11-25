import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

export const courseRouter = createTRPCRouter({
	getCourseProgress: protectedProcedure
		.input(z.object({ courseId: z.string() }))
		.query(async ({ ctx, input }) => {
			const course = await ctx.db.course.findUnique({
				where: { id: input.courseId },
				include: {
					chapters: {
						orderBy: { position: 'asc' }
					},
					chapterProgress: {
						where: { userId: ctx.session.user.id }
					}
				}
			})

			if (!course) {
				throw new Error('Course not found')
			}

			return {
				chapters: course.chapters,
				completedChapterIds: course.chapterProgress.map((progress) => progress.chapterId)
			}
		})
})
