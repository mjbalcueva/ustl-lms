import {
	createCourseSchema,
	getCoursesSchema,
	updateCodeSchema,
	updateDescriptionSchema,
	updateImageSchema,
	updateTitleSchema
} from '@/shared/validations/course'

import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

export const courseRouter = createTRPCRouter({
	createCourse: instructorProcedure.input(createCourseSchema).mutation(async ({ ctx, input }) => {
		const { code, title } = input

		const course = await ctx.db.course.create({
			data: {
				code,
				title,
				createdById: ctx.session.user.id!
			}
		})

		return { message: 'Course created!', course }
	}),

	getCourse: instructorProcedure.input(getCoursesSchema).query(async ({ ctx, input }) => {
		const { courseId } = input

		const course = await ctx.db.course.findUnique({
			where: { id: courseId, createdById: ctx.session.user.id! }
		})

		return { course }
	}),

	updateCode: instructorProcedure.input(updateCodeSchema).mutation(async ({ ctx, input }) => {
		const { courseId, code } = input

		const course = await ctx.db.course.update({
			where: { id: courseId, createdById: ctx.session.user.id! },
			data: { code }
		})

		return { message: 'Course code updated!', course }
	}),

	updateTitle: instructorProcedure.input(updateTitleSchema).mutation(async ({ ctx, input }) => {
		const { courseId, title } = input

		const course = await ctx.db.course.update({
			where: { id: courseId, createdById: ctx.session.user.id! },
			data: { title }
		})

		return { message: 'Course title updated!', course }
	}),

	updateDescription: instructorProcedure.input(updateDescriptionSchema).mutation(async ({ ctx, input }) => {
		const { courseId, description } = input

		const course = await ctx.db.course.update({
			where: { id: courseId, createdById: ctx.session.user.id! },
			data: { description }
		})

		return { message: 'Course description updated!', course }
	}),

	updateImage: instructorProcedure.input(updateImageSchema).mutation(async ({ ctx, input }) => {
		const { courseId, image } = input

		const course = await ctx.db.course.update({
			where: { id: courseId, createdById: ctx.session.user.id! },
			data: { image }
		})

		return { message: 'Course image updated!', course }
	})
})
