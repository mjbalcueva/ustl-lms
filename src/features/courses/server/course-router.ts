import { TRPCClientError } from '@trpc/client'

import { createTRPCRouter, instructorProcedure, protectedProcedure } from '@/server/api/trpc'

import { muxVideo } from '@/services/mux/video'
import { utapi } from '@/services/uploadthing/utapi'

import { catchError } from '@/core/lib/utils/catch-error'

import { generateCourseInviteToken } from '@/features/courses/lib/tokens'
import {
	addCourseAttachmentSchema,
	deleteCourseAttachmentSchema
} from '@/features/courses/validations/course-attachments-schema'
import {
	addCourseCategorySchema,
	editManyCourseCategoriesSchema
} from '@/features/courses/validations/course-categories-schema'
import {
	addCourseChapterSchema,
	editCourseChapterOrderSchema
} from '@/features/courses/validations/course-chapters-schema'
import { editCourseCodeSchema } from '@/features/courses/validations/course-code-schema'
import { editCourseDescriptionSchema } from '@/features/courses/validations/course-description-schema'
import { editCourseImageSchema } from '@/features/courses/validations/course-image-schema'
import {
	addCourseSchema,
	deleteCourseSchema,
	findCourseSchema
} from '@/features/courses/validations/course-schema'
import { editCourseStatusSchema } from '@/features/courses/validations/course-status-schema'
import { editCourseTitleSchema } from '@/features/courses/validations/course-title-schema'
import { editCourseTokenSchema } from '@/features/courses/validations/course-token-schema'

export const courseRouter = createTRPCRouter({
	// Instructor
	//
	findCourse: instructorProcedure.input(findCourseSchema).query(async ({ ctx, input }) => {
		const { courseId } = input

		const course = await ctx.db.course.findUnique({
			where: { id: courseId, instructorId: ctx.session.user.id },
			include: {
				attachments: {
					where: { chapterId: null },
					orderBy: { createdAt: 'desc' }
				},
				categories: { orderBy: { name: 'asc' } },
				chapters: { orderBy: { position: 'asc' } }
			}
		})

		return { course }
	}),

	findManyCourses: instructorProcedure.query(async ({ ctx }) => {
		const courses = await ctx.db.course.findMany({
			where: { instructorId: ctx.session.user.id },
			orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
			include: {
				chapters: true,
				_count: {
					select: {
						enrollments: true,
						chapters: true
					}
				}
			}
		})

		return courses
	}),

	addCourse: instructorProcedure.input(addCourseSchema).mutation(async ({ ctx, input }) => {
		const { code, title } = input
		const token = generateCourseInviteToken()

		const { id: newCourseId } = await ctx.db.course.create({
			data: {
				code,
				title,
				token,
				instructorId: ctx.session.user.id
			}
		})

		return { message: 'Course created!', newCourseId }
	}),

	deleteCourse: instructorProcedure.input(deleteCourseSchema).mutation(async ({ ctx, input }) => {
		const { id } = input

		const course = await ctx.db.course.findUnique({
			where: { id, instructorId: ctx.session.user.id },
			include: { chapters: true }
		})

		for (const chapter of course?.chapters ?? []) {
			const oldVideoKey = chapter?.videoUrl?.split('/f/')[1]
			if (oldVideoKey) await utapi.deleteFiles(oldVideoKey)

			const existingMuxData = await ctx.db.muxData.findFirst({
				where: { chapterId: chapter.id }
			})

			if (existingMuxData) {
				await muxVideo.assets.delete(existingMuxData.assetId)
				await ctx.db.muxData.delete({
					where: { id: existingMuxData.id }
				})
			}

			const attachments = await ctx.db.attachment.findMany({
				where: { chapterId: chapter.id }
			})

			for (const attachment of attachments) {
				const attachmentKey = attachment.url.split('/f/')[1]
				if (attachmentKey) await utapi.deleteFiles(attachmentKey)
			}
		}

		const oldImageKey = course?.imageUrl?.split('/f/')[1]
		if (oldImageKey) await utapi.deleteFiles(oldImageKey)

		await ctx.db.course.delete({ where: { id, instructorId: ctx.session.user.id } })

		return { message: 'Course deleted!' }
	}),

	editToken: instructorProcedure.input(editCourseTokenSchema).mutation(async ({ ctx, input }) => {
		const { id, token } = input

		const existingCourse = await ctx.db.course.findFirst({
			where: { token, NOT: { id } }
		})

		if (existingCourse) {
			throw new Error('Token already exists. Please choose a different token.')
		}

		const { token: newToken } = await ctx.db.course.update({
			where: { id, instructorId: ctx.session.user.id },
			data: { token }
		})

		return { message: 'Course token updated!', newToken }
	}),

	editCode: instructorProcedure.input(editCourseCodeSchema).mutation(async ({ ctx, input }) => {
		const { id, code } = input

		const { code: newCode } = await ctx.db.course.update({
			where: { id, instructorId: ctx.session.user.id },
			data: { code }
		})

		return { message: 'Course code updated!', newCode }
	}),

	editTitle: instructorProcedure.input(editCourseTitleSchema).mutation(async ({ ctx, input }) => {
		const { id, title } = input

		const { title: newTitle } = await ctx.db.course.update({
			where: { id, instructorId: ctx.session.user.id },
			data: { title }
		})

		return { message: 'Course title updated!', newTitle }
	}),

	editDescription: instructorProcedure
		.input(editCourseDescriptionSchema)
		.mutation(async ({ ctx, input }) => {
			const { id: courseId, description } = input

			const { description: newDescription } = await ctx.db.course.update({
				where: { id: courseId, instructorId: ctx.session.user.id },
				data: { description }
			})

			return { message: 'Course description updated!', newDescription }
		}),

	editImage: instructorProcedure.input(editCourseImageSchema).mutation(async ({ ctx, input }) => {
		const { id, imageUrl } = input

		const course = await ctx.db.course.findUnique({
			where: { id, instructorId: ctx.session.user.id },
			select: { imageUrl: true }
		})

		const oldImageKey = course?.imageUrl?.split('/f/')[1]
		if (oldImageKey) await utapi.deleteFiles(oldImageKey)

		await ctx.db.course.update({
			where: { id, instructorId: ctx.session.user.id },
			data: { imageUrl }
		})

		return { message: 'Course image updated!' }
	}),

	editStatus: instructorProcedure.input(editCourseStatusSchema).mutation(async ({ ctx, input }) => {
		const { id, status } = input

		const [data, error] = await catchError(
			ctx.db.course.updateMany({
				where: { id, instructorId: ctx.session.user.id },
				data: { status }
			})
		)

		if (error) {
			throw error
		}

		if (data?.count === 0) {
			throw new TRPCClientError('Course not found or you are not authorized to update it.')
		}

		const statusMessages: Record<string, string> = {
			PUBLISHED: 'Course published successfully',
			DRAFT: 'Course saved as draft',
			ARCHIVED: 'Course archived successfully'
		}

		return { message: statusMessages[status] ?? 'Course status updated successfully' }
	}),

	findManyCategories: instructorProcedure.query(async ({ ctx }) => {
		const categories = await ctx.db.category.findMany({
			where: { instructorId: ctx.session.user.id },
			orderBy: { name: 'asc' }
		})
		return { categories }
	}),

	addCategory: instructorProcedure
		.input(addCourseCategorySchema)
		.mutation(async ({ ctx, input }) => {
			const { name } = input

			const existingCategory = await ctx.db.category.findFirst({
				where: {
					name,
					instructorId: ctx.session.user.id
				}
			})

			if (existingCategory) {
				throw new TRPCClientError('A category with this name already exists')
			}

			const category = await ctx.db.category.create({
				data: {
					name,
					instructorId: ctx.session.user.id
				}
			})

			return { message: 'Category added!', newCategoryId: category.id }
		}),

	editCategories: instructorProcedure
		.input(editManyCourseCategoriesSchema)
		.mutation(async ({ ctx, input }) => {
			const { id, categoryIds } = input

			await ctx.db.course.update({
				where: { id, instructorId: ctx.session.user.id },
				data: {
					categories: {
						set: categoryIds.map((categoryId) => ({ id: categoryId }))
					}
				}
			})

			return { message: 'Course categories updated!', newCategoryIds: categoryIds }
		}),

	addAttachment: instructorProcedure
		.input(addCourseAttachmentSchema)
		.mutation(async ({ ctx, input }) => {
			const { courseId, url, name } = input

			const courseOwner = await ctx.db.course.findUnique({
				where: { id: courseId, instructorId: ctx.session.user.id }
			})
			if (!courseOwner) throw new Error('Course not found')

			await ctx.db.attachment.create({
				data: { courseId, url, name }
			})

			return { message: 'Course attachment created!' }
		}),

	deleteAttachment: instructorProcedure
		.input(deleteCourseAttachmentSchema)
		.mutation(async ({ ctx, input }) => {
			const { attachmentId } = input

			const attachment = await ctx.db.attachment.delete({
				where: { id: attachmentId, course: { instructorId: ctx.session.user.id } }
			})

			const attachmentKey = attachment?.url.split('/f/')[1]
			if (attachmentKey) await utapi.deleteFiles(attachmentKey)

			return { message: 'Course attachment deleted!', attachment }
		}),

	addChapter: instructorProcedure.input(addCourseChapterSchema).mutation(async ({ ctx, input }) => {
		const { courseId, title, type } = input

		const lastChapter = await ctx.db.chapter.findFirst({
			where: { courseId, course: { instructorId: ctx.session.user.id } },
			orderBy: { position: 'desc' }
		})

		const newPosition = lastChapter ? lastChapter.position + 1 : 1

		await ctx.db.chapter.create({
			data: { title, courseId, position: newPosition, type }
		})

		return { message: 'Chapter created successfully' }
	}),

	editChapterOrder: instructorProcedure
		.input(editCourseChapterOrderSchema)
		.mutation(async ({ ctx, input }) => {
			const { courseId, chapterList } = input

			for (const chapter of chapterList) {
				const newPosition = chapter.position + 1

				await ctx.db.chapter.update({
					where: { id: chapter.id, courseId },
					data: { position: newPosition }
				})
			}

			return { message: 'Chapters reordered successfully' }
		}),

	// Student
	//
	findEnrolledCourses: protectedProcedure.query(async ({ ctx }) => {
		const courses = await ctx.db.course.findMany({
			where: {
				enrollments: {
					some: { userId: ctx.session.user.id }
				}
			},
			include: {
				instructor: {
					select: {
						profile: {
							select: { name: true }
						}
					}
				},
				categories: {
					select: { name: true }
				}
			}
		})

		return {
			courses: courses.map((course) => ({
				id: course.id,
				title: course.title,
				description: course.description,
				imageUrl: course.imageUrl,
				code: course.code,
				status: course.status,
				instructor: course.instructor.profile?.name ?? 'Unknown Instructor',
				tags: course.categories.map((category) => category.name)
			}))
		}
	}),

	findEnrolledCourseDetails: protectedProcedure
		.input(findCourseSchema)
		.query(async ({ ctx, input }) => {
			const { courseId } = input
			const userId = ctx.session.user.id

			const course = await ctx.db.course.findFirst({
				where: {
					id: courseId,
					status: { not: 'DRAFT' }
				},
				include: {
					instructor: {
						include: {
							profile: {
								select: {
									name: true,
									bio: true,
									imageUrl: true
								}
							}
						}
					},
					chapters: {
						orderBy: { position: 'asc' },
						include: {
							chapterProgress: {
								where: { studentId: userId },
								take: 1
							}
						}
					},
					attachments: {
						orderBy: { name: 'desc' }
					},
					categories: true,
					enrollments: {
						where: {
							userId: ctx.session.user.id
						}
					},
					_count: {
						select: {
							enrollments: true
						}
					}
				}
			})

			if (!course) {
				throw new TRPCClientError('Course not found')
			}

			const totalChapters = course.chapters.length
			const completedChapters = course.chapters.filter(
				(chapter) => chapter.chapterProgress.length > 0 && chapter.chapterProgress[0]?.isCompleted
			).length
			const overallProgress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0

			return {
				course: {
					...course,
					progress: overallProgress,
					instructor: {
						profile: course.instructor.profile ?? {
							name: null,
							bio: null,
							imageUrl: null
						},
						email: course.instructor.email
					}
				}
			}
		})
})
