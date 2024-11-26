import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

export const courseTagsRouter = createTRPCRouter({
	// ---------------------------------------------------------------------------
	// CREATE
	// ---------------------------------------------------------------------------
	//

	// ---------------------------------------------------------------------------
	// READ
	// ---------------------------------------------------------------------------
	//

	// Find Many Course Tags
	findManyCourseTags: instructorProcedure.query(async ({ ctx }) => {
		const instructorId = ctx.session.user.id

		const tags = await ctx.db.courseTag.findMany({
			where: { instructorId },
			orderBy: { name: 'asc' }
		})

		return { tags }
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
