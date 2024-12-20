import { TRPCClientError } from '@trpc/client'

import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

import { muxVideo } from '@/services/mux/video'
import { utapi } from '@/services/uploadthing/utapi'

import { generateCourseInviteToken } from '@/features/courses/shared/lib/generate-course-invite-token'
import {
	addCourseSchema,
	deleteCourseSchema,
	editCourseCodeSchema,
	editCourseDescriptionSchema,
	editCourseImageSchema,
	editCourseTitleSchema,
	editCourseTokenSchema,
	editStatusSchema,
	findOneCourseSchema
} from '@/features/courses/shared/validations/course-schema'

export const courseRouter = createTRPCRouter({
	// ---------------------------------------------------------------------------
	// CREATE
	// ---------------------------------------------------------------------------
	//

	// Add Course
	addCourse: instructorProcedure
		.input(addCourseSchema)
		.mutation(async ({ ctx, input }) => {
			const { code, title } = input
			const token = generateCourseInviteToken()

			const currentYear = new Date().getFullYear()

			const course = await ctx.db.course.create({
				data: {
					code,
					title,
					token,
					instructorId: ctx.session.user.id,
					groupChats: {
						create: [
							{
								name: `${code} ${currentYear} Group Chat`,
								type: 'TEXT',
								creatorId: ctx.session.user.id,
								members: {
									create: {
										userId: ctx.session.user.id,
										role: 'OWNER'
									}
								}
							},
							{
								name: `${code} ${currentYear} Forum`,
								type: 'FORUM',
								isPrivate: true,
								isLocked: true,
								creatorId: ctx.session.user.id,
								members: {
									create: {
										userId: ctx.session.user.id,
										role: 'OWNER'
									}
								}
							}
						]
					}
				}
			})

			return { message: 'Course created!', course }
		}),

	// ---------------------------------------------------------------------------
	// READ
	// ---------------------------------------------------------------------------
	//

	// Find One Course
	findOneCourse: instructorProcedure
		.input(findOneCourseSchema)
		.query(async ({ ctx, input }) => {
			const { courseId } = input
			const instructorId = ctx.session.user.id

			const course = await ctx.db.course.findUnique({
				where: { courseId, instructorId },
				include: {
					tags: { orderBy: { name: 'asc' } },
					attachments: { orderBy: { createdAt: 'desc' } },
					chapters: { orderBy: { position: 'asc' } },
					_count: { select: { tags: true, chapters: true, attachments: true } }
				}
			})

			if (!course) throw new TRPCClientError('Course not found')

			return { course }
		}),

	// Find Many Courses
	findManyCourses: instructorProcedure.query(async ({ ctx }) => {
		const instructorId = ctx.session.user.id

		const courses = await ctx.db.course.findMany({
			where: { instructorId },
			orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
			include: {
				_count: {
					select: { enrollments: true, chapters: true }
				},
				chapters: {
					include: { chapterProgress: true }
				},
				enrollments: true
			}
		})

		const count = {
			total: courses.length,
			draft: courses.filter((c) => c.status === 'DRAFT').length,
			published: courses.filter((c) => c.status === 'PUBLISHED').length,
			archived: courses.filter((c) => c.status === 'ARCHIVED').length
		}

		const stats = {
			students: courses.reduce(
				(acc, c) => acc + (c._count?.enrollments ?? 0),
				0
			),
			chapters: courses.reduce((acc, c) => acc + (c._count?.chapters ?? 0), 0),
			averageStudentsPerCourse: courses.length
				? courses.reduce((acc, c) => acc + (c._count?.enrollments ?? 0), 0) /
					courses.length
				: 0,
			completionRate: courses
				.flatMap((course) => {
					// Skip courses with no chapters
					if (!course.chapters.length) return []

					// Calculate completion rate for each enrollment
					return course.enrollments.map((enrollment) => {
						// Count completed chapters for this student
						const completedChapters = course.chapters.filter((chapter) =>
							chapter.chapterProgress.some(
								(progress) =>
									progress.studentId === enrollment.studentId &&
									progress.isCompleted
							)
						).length

						// Calculate percentage
						return (completedChapters / course.chapters.length) * 100
					})
				})
				// Calculate average completion rate across all enrollments
				.reduce(
					(total, rate, _, allRates) =>
						allRates.length ? total + rate / allRates.length : 0,
					0
				)
		}

		return { courses, count, stats }
	}),

	// ---------------------------------------------------------------------------
	// UPDATE
	// ---------------------------------------------------------------------------
	//

	// Edit Course Code
	editCode: instructorProcedure
		.input(editCourseCodeSchema)
		.mutation(async ({ ctx, input }) => {
			const { courseId, code } = input

			const updatedCourse = await ctx.db.course.update({
				where: { courseId },
				data: { code }
			})

			return {
				message: 'Course code updated successfully',
				updatedCourse
			}
		}),

	// Edit Course Title
	editTitle: instructorProcedure
		.input(editCourseTitleSchema)
		.mutation(async ({ ctx, input }) => {
			const { courseId, title } = input

			const updatedCourse = await ctx.db.course.update({
				where: { courseId },
				data: { title }
			})

			return {
				message: 'Course title updated successfully',
				updatedCourse
			}
		}),

	// Edit Course Description
	editDescription: instructorProcedure
		.input(editCourseDescriptionSchema)
		.mutation(async ({ ctx, input }) => {
			const { courseId, description } = input

			const updatedCourse = await ctx.db.course.update({
				where: { courseId },
				data: { description }
			})

			return {
				message: 'Course description updated successfully',
				updatedCourse
			}
		}),

	// Edit Course Image
	editImage: instructorProcedure
		.input(editCourseImageSchema)
		.mutation(async ({ ctx, input: { courseId, imageUrl } }) => {
			const oldImageKey = (
				await ctx.db.course.findUnique({
					where: { courseId },
					select: { imageUrl: true }
				})
			)?.imageUrl?.split('/f/')[1]

			if (oldImageKey) await utapi.deleteFiles(oldImageKey)

			const updatedCourse = await ctx.db.course.update({
				where: { courseId },
				data: { imageUrl }
			})

			return {
				message: 'Course image updated successfully',
				updatedCourse
			}
		}),

	// Edit Course Token
	editCourseToken: instructorProcedure
		.input(editCourseTokenSchema)
		.mutation(async ({ ctx, input }) => {
			const { courseId, token } = input

			// Check if token already exists for another course
			const existingCourse = await ctx.db.course.findFirst({
				where: { token, NOT: { courseId } }
			})

			if (existingCourse) {
				throw new TRPCClientError(
					'Token already exists. Please choose a different token.'
				)
			}

			const updatedCourse = await ctx.db.course.update({
				where: { courseId },
				data: { token }
			})

			return {
				message: 'Course token updated successfully',
				updatedCourse
			}
		}),

	// Edit Course Status
	editStatus: instructorProcedure
		.input(editStatusSchema)
		.mutation(async ({ ctx, input }) => {
			const { courseId, status } = input

			const updatedCourse = await ctx.db.course.update({
				where: { courseId },
				data: { status }
			})

			const statusMessages: Record<string, string> = {
				PUBLISHED: 'Course published successfully',
				DRAFT: 'Course saved as draft',
				ARCHIVED: 'Course archived successfully'
			}

			return {
				message: statusMessages[status] ?? 'Course status updated successfully',
				updatedCourse
			}
		}),

	// ---------------------------------------------------------------------------
	// DELETE
	// ---------------------------------------------------------------------------
	//

	// Delete Course
	deleteCourse: instructorProcedure
		.input(deleteCourseSchema)
		.mutation(async ({ ctx, input }) => {
			const { courseId } = input

			// Fetch course with chapters to handle cleanup of associated content
			const course = await ctx.db.course.findUnique({
				where: { courseId },
				include: { chapters: true }
			})

			// Collect all file keys that need to be deleted from uploadthing storage:
			// 1. Chapter video files
			// 2. Course image
			// Filter out any null/undefined values
			const filesToDelete = [
				...(course?.chapters ?? []).map((ch) => ch.videoUrl?.split('/f/')[1]),
				course?.imageUrl?.split('/f/')[1]
			].filter(Boolean)

			// Get all course attachments to include their files in deletion
			const attachments = await ctx.db.courseAttachment.findMany({
				where: { courseId }
			})

			// Add attachment file keys to deletion list
			filesToDelete.push(
				...attachments.map((a) => a.url.split('/f/')[1]).filter(Boolean)
			)

			// Clean up Mux video assets and their metadata:
			// 1. Delete video assets from Mux
			// 2. Remove corresponding entries from our database
			for (const chapter of course?.chapters ?? []) {
				const existingMuxData = await ctx.db.chapterMuxData.findFirst({
					where: { chapterId: chapter.chapterId }
				})

				if (existingMuxData) {
					await muxVideo.assets.delete(existingMuxData.assetId)
					await ctx.db.chapterMuxData.delete({
						where: { muxId: existingMuxData.muxId }
					})
				}
			}

			// Delete all collected files from uploadthing storage in parallel
			await Promise.all(
				filesToDelete.map((key) => utapi.deleteFiles(key ?? ''))
			)

			// Finally delete the course itself, which will cascade delete
			// related records due to database constraints
			await ctx.db.course.delete({
				where: { courseId }
			})

			return { message: 'Course deleted successfully' }
		})
})
