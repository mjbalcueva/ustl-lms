import { editCourseCategoriesSchema } from '@/shared/validations/category'

import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

export const categoryRouter = createTRPCRouter({
	getCategories: instructorProcedure.query(async ({ ctx }) => {
		const categories = await ctx.db.category.findMany({
			orderBy: { name: 'asc' }
		})
		return { categories }
	}),

	editCategories: instructorProcedure.input(editCourseCategoriesSchema).mutation(async ({ ctx, input }) => {
		const { id, categoryIds } = input

		await ctx.db.course.update({
			where: { id, instructorId: ctx.session.user.id! },
			data: {
				categories: { set: categoryIds.map((categoryId) => ({ id: categoryId })) }
			}
		})

		return { message: 'Course categories updated!', newCategoryIds: categoryIds }
	})
})
