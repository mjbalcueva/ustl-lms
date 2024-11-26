import { TRPCClientError } from '@trpc/client'

import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

import {
	addCourseTagSchema,
	editManyCourseTagsSchema
} from '../../shared/validations/course-tags-schema'

export const courseTagsRouter = createTRPCRouter({
	// ---------------------------------------------------------------------------
	// CREATE
	// ---------------------------------------------------------------------------
	//

	// Add Course Tag
	addCourseTag: instructorProcedure
		.input(addCourseTagSchema)
		.mutation(async ({ ctx, input }) => {
			const { name } = input
			const instructorId = ctx.session.user.id

			// Check if tag already exists for this instructor
			const existingTag = await ctx.db.courseTag.findFirst({
				where: { name, instructorId }
			})

			if (existingTag) {
				throw new TRPCClientError('A tag with this name already exists')
			}

			const tag = await ctx.db.courseTag.create({
				data: { name, instructorId }
			})

			return { message: 'Tag added!', tag }
		}),

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
	}),

	// ---------------------------------------------------------------------------
	// UPDATE
	// ---------------------------------------------------------------------------
	//

	// Edit Course Tags
	editManyCourseTags: instructorProcedure
		.input(editManyCourseTagsSchema)
		.mutation(async ({ ctx, input }) => {
			const { courseId, tagIds } = input
			const instructorId = ctx.session.user.id

			await ctx.db.course.update({
				where: { courseId, instructorId },
				data: {
					tags: {
						set: tagIds.map((tagId) => ({ tagId }))
					}
				}
			})

			return {
				message: 'Course tags updated!',
				newTagIds: tagIds
			}
		})

	// ---------------------------------------------------------------------------
	// DELETE
	// ---------------------------------------------------------------------------
	//
})
