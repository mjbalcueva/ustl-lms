import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

import { findOneChapterSchema } from '@/features/chapters/shared/validations/chapter-schema'

export const chapterRouter = createTRPCRouter({
	// ---------------------------------------------------------------------------
	// CREATE
	// ---------------------------------------------------------------------------
	//
	// ---------------------------------------------------------------------------
	// READ
	// ---------------------------------------------------------------------------
	//

	// Find One Chapter
	findOneChapter: instructorProcedure
		.input(findOneChapterSchema)
		.query(async ({ ctx, input }) => {
			const { chapterId } = input
			const instructorId = ctx.session.user.id

			const chapter = await ctx.db.chapter.findUnique({
				where: { chapterId, course: { instructorId } }
			})

			return { chapter }
		})

	// ---------------------------------------------------------------------------
	// UPDATE
	// ---------------------------------------------------------------------------
	//
	// ---------------------------------------------------------------------------
	// DELETE
	// ---------------------------------------------------------------------------
	//
})
