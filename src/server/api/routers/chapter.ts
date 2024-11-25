import { z } from 'zod'

import {
	chapterSchema,
	getChapterDetailsSchema,
	markChapterCompleteSchema
} from '@/server/api/schemas/chapter'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

export const chapterRouter = createTRPCRouter({
	getChapterDetails: protectedProcedure
		.input(getChapterDetailsSchema)
		.query(async ({ ctx, input }) => {
			const chapter = await ctx.db.chapter.findUnique({
				where: {
					id: input.chapterId,
					courseId: input.courseId
				},
				include: {
					resources: true,
					aiMessages: {
						include: {
							author: true
						}
					},
					forumMessages: {
						include: {
							author: true
						}
					}
				}
			})

			if (!chapter) {
				throw new Error('Chapter not found')
			}

			return chapter
		}),

	markAsComplete: protectedProcedure
		.input(markChapterCompleteSchema)
		.mutation(async ({ ctx, input }) => {
			const chapterProgress = await ctx.db.chapterProgress.create({
				data: {
					chapterId: input.chapterId,
					userId: ctx.session.user.id,
					courseId: input.courseId,
					completedAt: new Date()
				}
			})

			return chapterProgress
		})
})
