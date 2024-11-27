import { TRPCClientError } from '@trpc/client'

import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'

import { muxVideo } from '@/services/mux/video'
import { utapi } from '@/services/uploadthing/utapi'

import {
	deleteChapterSchema,
	deleteChapterVideoSchema,
	editChapterContentSchema,
	editChapterStatusSchema,
	editChapterTitleSchema,
	editChapterTypeSchema,
	editChapterVideoSchema,
	findOneChapterSchema
} from '@/features/chapters/shared/validations/chapter-schema'

export const chapterRouter = createTRPCRouter({
	// ---------------------------------------------------------------------------
	// CREATE
	// ---------------------------------------------------------------------------
	//

	// ---------------------------------------------------------------------------
	// READ
	// ---------------------------------------------------------------------------
	//

	// Find One Chapter
	findOneChapter: instructorProcedure
		.input(findOneChapterSchema)
		.query(async ({ ctx, input }) => {
			const { chapterId } = input
			const instructorId = ctx.session.user.id

			const chapter = await ctx.db.chapter.findUnique({
				where: { chapterId, course: { instructorId } },
				include: {
					course: { select: { title: true } },
					muxData: true,
					attachments: { orderBy: { createdAt: 'desc' } }
				}
			})

			if (!chapter) throw new TRPCClientError('Chapter not found')

			return { chapter }
		}),

	// ---------------------------------------------------------------------------
	// UPDATE
	// ---------------------------------------------------------------------------
	//

	// Edit Chapter Title
	editTitle: instructorProcedure
		.input(editChapterTitleSchema)
		.mutation(async ({ ctx, input }) => {
			const { chapterId, title } = input
			const instructorId = ctx.session.user.id

			const updatedChapter = await ctx.db.chapter.update({
				where: { chapterId, course: { instructorId } },
				data: { title }
			})

			return { message: 'Chapter title updated successfully', updatedChapter }
		}),

	// Edit Chapter Content
	editContent: instructorProcedure
		.input(editChapterContentSchema)
		.mutation(async ({ ctx, input }) => {
			const { chapterId, content } = input
			const instructorId = ctx.session.user.id

			const updatedChapter = await ctx.db.chapter.update({
				where: { chapterId, course: { instructorId } },
				data: { content }
			})

			return { message: 'Chapter content updated successfully', updatedChapter }
		}),

	// Edit Chapter Type
	editType: instructorProcedure
		.input(editChapterTypeSchema)
		.mutation(async ({ ctx, input }) => {
			const { chapterId, type } = input
			const instructorId = ctx.session.user.id

			const updatedChapter = await ctx.db.chapter.update({
				where: { chapterId, course: { instructorId } },
				data: { type }
			})

			return { message: 'Chapter type updated successfully', updatedChapter }
		}),

	// Edit Chapter Status
	editStatus: instructorProcedure
		.input(editChapterStatusSchema)
		.mutation(async ({ ctx, input }) => {
			const { chapterId, status } = input
			const instructorId = ctx.session.user.id

			const updatedChapter = await ctx.db.chapter.update({
				where: { chapterId, course: { instructorId } },
				data: { status }
			})

			return { message: 'Chapter status updated successfully', updatedChapter }
		}),

	// Edit Chapter Video
	editVideo: instructorProcedure
		.input(editChapterVideoSchema)
		.mutation(async ({ ctx, input }) => {
			const { chapterId, videoUrl } = input
			const instructorId = ctx.session.user.id

			// Delete old video file if exists
			const chapter = await ctx.db.chapter.findUnique({
				where: { chapterId, course: { instructorId } },
				select: { videoUrl: true }
			})
			const oldVideoKey = chapter?.videoUrl?.split('/f/')[1]
			if (oldVideoKey) await utapi.deleteFiles(oldVideoKey)

			// Delete old Mux asset if exists
			const existingMuxData = await ctx.db.chapterMuxData.findFirst({
				where: { chapterId }
			})
			if (existingMuxData) {
				await muxVideo.assets.delete(existingMuxData.assetId)
				await ctx.db.chapterMuxData.delete({
					where: { muxId: existingMuxData.muxId }
				})
			}

			// Create new Mux asset and update chapter
			const asset = await muxVideo.assets.create({
				input: [{ url: videoUrl }],
				playback_policy: ['public']
			})

			const [updatedChapter] = await Promise.all([
				ctx.db.chapter.update({
					where: { chapterId, course: { instructorId } },
					data: { videoUrl }
				}),
				ctx.db.chapterMuxData.create({
					data: {
						chapterId,
						assetId: asset.id,
						playbackId: asset.playback_ids?.[0]?.id ?? ''
					}
				})
			])

			return { message: 'Chapter video updated successfully', updatedChapter }
		}),

	// ---------------------------------------------------------------------------
	// DELETE
	// ---------------------------------------------------------------------------
	//

	// Delete Chapter
	deleteChapter: instructorProcedure
		.input(deleteChapterSchema)
		.mutation(async ({ ctx, input }) => {
			const { chapterId } = input
			const instructorId = ctx.session.user.id

			// Find chapter and verify ownership
			const chapter = await ctx.db.chapter.findUnique({
				where: { chapterId, course: { instructorId } }
			})
			if (!chapter) throw new TRPCClientError('Chapter not found')

			// Delete Mux video data
			const muxData = await ctx.db.chapterMuxData.findFirst({
				where: { chapterId }
			})
			if (muxData) {
				await muxVideo.assets.delete(muxData.assetId)
				await ctx.db.chapterMuxData.delete({
					where: { muxId: muxData.muxId }
				})
			}

			// Delete attachment files
			const attachments = await ctx.db.chapterAttachment.findMany({
				where: { chapterId }
			})
			await Promise.all(
				attachments
					.map((a) => a.url.split('/f/')[1])
					.filter((key): key is string => !!key)
					.map((key) => utapi.deleteFiles(key))
			)

			// Delete chapter and cascade related records
			await ctx.db.chapter.delete({ where: { chapterId } })

			return { message: 'Chapter deleted successfully' }
		}),

	// Delete Chapter Video
	deleteVideo: instructorProcedure
		.input(deleteChapterVideoSchema)
		.mutation(async ({ ctx, input }) => {
			const { chapterId } = input
			const instructorId = ctx.session.user.id

			const chapter = await ctx.db.chapter.findUnique({
				where: { chapterId, course: { instructorId } },
				include: { muxData: true }
			})
			if (!chapter) throw new TRPCClientError('Chapter not found')

			if (chapter.muxData) {
				await muxVideo.assets.delete(chapter.muxData.assetId)
				await ctx.db.chapterMuxData.delete({
					where: { muxId: chapter.muxData.muxId }
				})
			}

			await ctx.db.chapter.update({
				where: { chapterId },
				data: { videoUrl: null }
			})

			return { message: 'Chapter video deleted successfully' }
		})
})
