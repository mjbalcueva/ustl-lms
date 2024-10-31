import { redirect } from 'next/navigation'

import { auth } from '@/services/authjs/auth'
import { api } from '@/services/trpc/server'

import { NotFound } from '@/core/components/error-pages/not-found'

export default async function Page({
	params
}: {
	params: { courseId: string; chapterId: string }
}) {
	const { courseId, chapterId } = params
	const session = await auth()
	if (session?.user.role !== 'INSTRUCTOR') redirect(`/courses/${courseId}/${chapterId}`)

	const { chapter } = await api.chapter.findChapter({ courseId, id: chapterId })
	if (!chapter) return <NotFound item="chapter" />
	redirect(`/instructor/courses/${courseId}/${chapter.type.toLowerCase()}/${chapterId}`)
}
