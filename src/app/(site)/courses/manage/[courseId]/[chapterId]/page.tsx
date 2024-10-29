import { redirect } from 'next/navigation'

import { api } from '@/services/trpc/server'

import { NotFound } from '@/core/components/error-pages/not-found'

export default async function Page({
	params
}: {
	params: { courseId: string; chapterId: string }
}) {
	const { chapter } = await api.chapter.findChapter({
		courseId: params.courseId,
		id: params.chapterId
	})

	if (!chapter) return <NotFound item="chapter" />
	redirect(`/courses/manage/${chapter.course.id}/${chapter.type.toLowerCase()}/${chapter.id}`)
}
