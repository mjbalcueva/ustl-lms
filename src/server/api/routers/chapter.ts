import {
	addChapterSchema,
	chapterActionsSchema,
	editContentSchema,
	editTitleSchema,
	editVideoSchema,
	getChapterSchema,
	reorderChaptersSchema
} from '@/shared/validations/chapter'

import { createTRPCRouter, instructorProcedure } from '@/server/api/trpc'
import { video } from '@/server/lib/mux'
import { utapi } from '@/server/lib/utapi'

export const chapterRouter = createTRPCRouter({
	addChapter: instructorProcedure.input(addChapterSchema).mutation(async ({ ctx, input }) => {
		const { courseId, title } = input

		const lastChapter = await ctx.db.chapter.findFirst({
			where: { courseId, course: { createdById: ctx.session.user.id! } },
			orderBy: { position: 'desc' }
		})

		const newPosition = lastChapter ? lastChapter.position + 1 : 1

		await ctx.db.chapter.create({
			data: { title, courseId, position: newPosition }
		})

		return { message: 'Chapter created successfully' }
	}),

	deleteChapter: instructorProcedure.input(chapterActionsSchema).mutation(async ({ ctx, input }) => {
		const { id, courseId } = input

		// delete the chapter video from mux
		const chapter = await ctx.db.chapter.findUnique({
			where: { id, courseId, course: { createdById: ctx.session.user.id! } },
			select: { videoUrl: true }
		})

		const oldVideoKey = chapter?.videoUrl?.split('/f/')[1]
		if (oldVideoKey) await utapi.deleteFiles(oldVideoKey)

		const existingMuxData = await ctx.db.muxData.findFirst({
			where: { chapterId: id }
		})

		if (existingMuxData) {
			await video.assets.delete(existingMuxData.assetId)
			await ctx.db.muxData.delete({
				where: { id: existingMuxData.id }
			})
		}

		// delete all the chapter attachments in uploadthing
		const attachments = await ctx.db.attachment.findMany({
			where: { chapterId: id }
		})

		for (const attachment of attachments) {
			const attachmentKey = attachment.url.split('/f/')[1]
			if (attachmentKey) await utapi.deleteFiles(attachmentKey)
		}

		// delete the chapter
		await ctx.db.chapter.delete({
			where: { id, courseId, course: { createdById: ctx.session.user.id! } }
		})

		return { message: 'Chapter deleted successfully' }
	}),

	editContent: instructorProcedure.input(editContentSchema).mutation(async ({ ctx, input }) => {
		const { id, courseId, content } = input

		const { content: newContent } = await ctx.db.chapter.update({
			where: { id, courseId, course: { createdById: ctx.session.user.id! } },
			data: { content }
		})

		return {
			message: 'Chapter content updated successfully',
			newContent
		}
	}),

	editTitle: instructorProcedure.input(editTitleSchema).mutation(async ({ ctx, input }) => {
		const { id, courseId, title } = input

		const { title: newTitle } = await ctx.db.chapter.update({
			where: { id, courseId, course: { createdById: ctx.session.user.id! } },
			data: { title }
		})

		return {
			message: 'Chapter title updated successfully',
			newTitle
		}
	}),

	editVideo: instructorProcedure.input(editVideoSchema).mutation(async ({ ctx, input }) => {
		const { id, courseId, videoUrl } = input

		const chapter = await ctx.db.chapter.findUnique({
			where: { id, courseId, course: { createdById: ctx.session.user.id! } },
			select: { videoUrl: true }
		})

		const oldVideoKey = chapter?.videoUrl?.split('/f/')[1]
		if (oldVideoKey) await utapi.deleteFiles(oldVideoKey)

		const updatedChapter = await ctx.db.chapter.update({
			where: { id, courseId, course: { createdById: ctx.session.user.id! } },
			data: { videoUrl }
		})

		const existingMuxData = await ctx.db.muxData.findFirst({
			where: { chapterId: id }
		})

		if (existingMuxData) {
			await video.assets.delete(existingMuxData.assetId)
			await ctx.db.muxData.delete({
				where: { id: existingMuxData.id }
			})
		}

		const asset = await video.assets.create({
			input: [{ url: videoUrl ?? '' }],
			playback_policy: ['public'],
			test: false
		})

		await ctx.db.muxData.create({
			data: {
				chapterId: id,
				assetId: asset.id,
				playbackId: asset.playback_ids?.[0]?.id ?? ''
			}
		})

		return { message: 'Chapter video updated successfully', chapter: updatedChapter }
	}),

	getChapter: instructorProcedure.input(getChapterSchema).query(async ({ ctx, input }) => {
		const { id, courseId } = input

		const chapter = await ctx.db.chapter.findUnique({
			where: { id, courseId },
			include: { attachment: true, course: true, muxData: true }
		})

		return { chapter }
	}),

	toggleChapterPublish: instructorProcedure.input(chapterActionsSchema).mutation(async ({ ctx, input }) => {
		const { id, courseId, isPublished } = input

		const chapter = await ctx.db.chapter.update({
			where: { id, courseId, course: { createdById: ctx.session.user.id! } },
			data: { isPublished }
		})

		return { message: `Chapter ${isPublished ? 'published' : 'unpublished'} successfully`, chapter }
	}),

	reorderChapters: instructorProcedure.input(reorderChaptersSchema).mutation(async ({ ctx, input }) => {
		const { courseId, chapterList } = input

		for (const chapter of chapterList) {
			const newPosition = chapter.position + 1

			await ctx.db.chapter.update({
				where: { id: chapter.id, courseId },
				data: { position: newPosition }
			})
		}

		return { message: 'Chapters reordered successfully' }
	})
})
