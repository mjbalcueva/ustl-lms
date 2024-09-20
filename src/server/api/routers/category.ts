import { updateCategorySchema } from '@/shared/validations/category'

import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

export const categoryRouter = createTRPCRouter({
	getCategories: instructorProcedure.query(async ({ ctx }) => {
		const categories = await ctx.db.category.findMany({
			orderBy: { name: 'asc' }
		})
		return { categories }
	}),

	updateCategory: instructorProcedure.input(updateCategorySchema).mutation(async ({ ctx, input }) => {
		const { courseId, categoryId } = input

		const course = await ctx.db.course.update({
			where: { id: courseId, createdById: ctx.session.user.id! },
			data: { categoryId }
		})

		return { message: 'Course category updated!', course }
	})
})
