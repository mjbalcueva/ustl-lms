import { TRPCError } from '@trpc/server'

import { enrollmentSchema } from '@/shared/validations/enrollment'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const enrollmentRouter = createTRPCRouter({
	findClass: protectedProcedure.input(enrollmentSchema).query(async ({ ctx, input }) => {
		const { token } = input

		if (!ctx.session.user.id) {
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'You must be logged in to enroll in a course'
			})
		}

		const course = await ctx.db.course.findUnique({
			where: { token },
			include: {
				instructor: {
					select: {
						profile: {
							select: {
								name: true
							}
						}
					}
				},
				categories: true
			}
		})

		if (!course) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Course not found'
			})
		}

		return { ...course }
	}),

	enroll: protectedProcedure.input(enrollmentSchema).mutation(async ({ ctx, input }) => {
		const { token } = input

		if (!ctx.session.user.id) {
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'You must be logged in to enroll in a course'
			})
		}

		const course = await ctx.db.course.findUnique({
			where: { token },
			include: { instructor: true }
		})

		if (!course) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Invalid token'
			})
		}

		if (course.instructor.id === ctx.session.user.id) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'You cannot enroll in your own course.'
			})
		}

		const existingEnrollment = await ctx.db.enrollment.findFirst({
			where: {
				userId: ctx.session.user.id,
				courseId: course.id
			}
		})

		if (existingEnrollment) {
			throw new TRPCError({
				code: 'CONFLICT',
				message: 'You are already enrolled in this course.'
			})
		}

		const enrollment = await ctx.db.enrollment.create({
			data: {
				userId: ctx.session.user.id,
				courseId: course.id
			},
			include: { course: true }
		})

		return { message: 'Enrolled successfully.', enrollment }
	})
})
