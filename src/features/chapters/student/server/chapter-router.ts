import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

import {
	editChapterCompletionSchema,
	findOneChapterSchema
} from '@/features/chapters/shared/validations/chapter-schema'

export const chapterRouter = createTRPCRouter({
	// ---------------------------------------------------------------------------
	// READ
	// ---------------------------------------------------------------------------
	//

	// Find One Chapter
	findOneChapter: protectedProcedure
		.input(findOneChapterSchema)
		.query(async ({ ctx, input: { chapterId } }) => {
			const studentId = ctx.session.user.id

			const chapter = await ctx.db.chapter.findFirst({
				where: {
					chapterId,
					course: { enrollments: { some: { studentId } } }
				},
				include: {
					course: {
						select: {
							courseId: true,
							code: true,
							chapters: {
								select: {
									chapterId: true,
									title: true,
									type: true,
									createdAt: true,
									chapterProgress: {
										where: { studentId }
									}
								},
								orderBy: { position: 'asc' }
							}
						}
					},
					muxData: true,
					attachments: true,
					chapterProgress: { where: { studentId } }
				}
			})

			return { chapter }
		}),

	// ---------------------------------------------------------------------------
	// UPDATE
	// ---------------------------------------------------------------------------
	//

	// Edit Chapter Completion
	editChapterCompletion: protectedProcedure
		.input(editChapterCompletionSchema)
		.mutation(async ({ ctx, input: { chapterId } }) => {
			const studentId = ctx.session.user.id

			const existingProgress = await ctx.db.chapterProgress.findUnique({
				where: {
					chapterId_studentId: { chapterId, studentId }
				}
			})

			const progress = await ctx.db.chapterProgress.upsert({
				where: {
					chapterId_studentId: {
						chapterId,
						studentId
					}
				},
				update: {
					isCompleted: { set: !existingProgress?.isCompleted }
				},
				create: {
					user: { connect: { id: studentId } },
					chapter: { connect: { chapterId } },
					isCompleted: true
				}
			})

			return {
				message: progress.isCompleted
					? 'Chapter marked as completed'
					: 'Chapter marked as incomplete',
				isCompleted: progress.isCompleted
			}
		})
})
