import { redirect } from 'next/navigation'

import { api } from '@/services/trpc/server'

import { NotFound } from '@/core/components/error-pages/not-found'

export default async function Page({
	params: { courseId, chapterId }
}: {
	params: { courseId: string; chapterId: string }
}) {
	const { chapter } = await api.student.chapter.findOneChapter({ chapterId })
	if (!chapter) return <NotFound item="chapter" />
	redirect(`/courses/${courseId}/${chapter.type.toLowerCase()}/${chapterId}`)
}
