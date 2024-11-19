import { TRPCError } from '@trpc/server'

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

import { enrollmentSchema } from '@/features/enrollment/validations/enrollment'

export const enrollmentRouter = createTRPCRouter({
	findCourse: protectedProcedure.input(enrollmentSchema).query(async ({ ctx, input }) => {
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
		const { token } = input;
	  
		if (!ctx.session.user.id) {
		  throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'You must be logged in to enroll in a course',
		  });
		}
	  
		// Retrieve course, including the instructor and groupChat (if it exists)
		const course = await ctx.db.course.findUnique({
		  where: { token },
		  include: { instructor: true, groupChat: true },
		});
	  
		if (!course) {
		  throw new TRPCError({
			code: 'NOT_FOUND',
			message: 'Invalid token',
		  });
		}
	  
		if (course.instructor.id === ctx.session.user.id) {
		  throw new TRPCError({
			code: 'FORBIDDEN',
			message: 'You cannot enroll in your own course.',
		  });
		}
	  
		// Check if the user is already enrolled in the course
		const existingEnrollment = await ctx.db.enrollment.findFirst({
		  where: {
			userId: ctx.session.user.id,
			courseId: course.id,
		  },
		});
	  
		if (existingEnrollment) {
		  throw new TRPCError({
			code: 'CONFLICT',
			message: 'You are already enrolled in this course.',
		  });
		}
	  
		
		await ctx.db.enrollment.create({
		  data: {
			userId: ctx.session.user.id,
			courseId: course.id,
			groupChatId: course.groupChat ? course.groupChat.id : null,
		  },
		  include: { course: true },
		});

		if (course.groupChat) {
			await ctx.db.groupChat.update({
			  where: { id: course.groupChat.id },
			  data: {
				members: {
				  push: ctx.session.user.id, 
				},
			  },
			});
		  }
	  
		return { message: 'Enrolled successfully.' };
	  }),
	  
})
