import { redirect } from 'next/navigation'

import { api } from '@/services/trpc/server'

import { NotFound } from '@/core/components/error-pages/not-found'

export default async function Page({
	params
}: {
	params: { courseId: string; chapterId: string }
}) {
	const { courseId, chapterId } = params

	const { chapter } = await api.chapter.findChapter({ courseId, id: chapterId })
	if (!chapter) return <NotFound item="chapter" />
	redirect(`/courses/${courseId}/${chapter.type.toLowerCase()}/${chapterId}`)
}
