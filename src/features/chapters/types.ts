import { type inferProcedureOutput } from '@trpc/server'

import { type AppRouter } from '@/server/api/root'

export type ChapterWithDetails = inferProcedureOutput<AppRouter['chapter']['getChapterDetails']>

export type Message = {
	id: string
	content: string
	timestamp: string
	author: {
		name: string
		avatar?: string
	}
}

export type Resource = {
	id: string
	name: string
	type: string
	size: string
	url: string
}

export type ChapterProgress = {
	isCompleted: boolean
	currentChapterId: string
	nextChapterId?: string
	previousChapterId?: string
}
