import { UTApi } from 'uploadthing/server'

import {
	createAttachmentSchema,
	createCourseSchema,
	getCoursesSchema,
	updateCategorySchema,
	updateCodeSchema,
	updateDescriptionSchema,
	updateImageSchema,
	updateTitleSchema
} from '@/shared/validations/course'

import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

const utapi = new UTApi()

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
			where: { id: courseId, createdById: ctx.session.user.id! },
			include: {
				attachment: { orderBy: { createdAt: 'desc' } }
			}
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

		const course = await ctx.db.course.findUnique({
			where: { id: courseId, createdById: ctx.session.user.id! },
			select: { image: true }
		})

		const oldImageKey = course?.image?.split('/f/')[1]
		if (oldImageKey) await utapi.deleteFiles(oldImageKey)

		const updatedCourse = await ctx.db.course.update({
			where: { id: courseId, createdById: ctx.session.user.id! },
			data: { image }
		})

		return { message: 'Course image updated!', course: updatedCourse }
	}),

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
	}),

	createAttachment: instructorProcedure.input(createAttachmentSchema).mutation(async ({ ctx, input }) => {
		const { courseId, attachmentUrl } = input

		const courseOwner = await ctx.db.course.findUnique({
			where: { id: courseId, createdById: ctx.session.user.id! }
		})

		if (!courseOwner) throw new Error('Course not found')

		const newAttachment = await ctx.db.attachment.create({
			data: {
				url: attachmentUrl,
				courseId: courseId,
				name: attachmentUrl.split('/').pop() ?? 'Untitled'
			}
		})

		return { message: 'Course attachment updated!', newAttachment }
	})
})
