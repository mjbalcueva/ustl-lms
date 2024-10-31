import { redirect } from 'next/navigation'

import { auth } from '@/services/authjs/auth'
import { api } from '@/services/trpc/server'

import { NotFound } from '@/core/components/error-pages/not-found'

export default async function Page({
	params
}: {
	params: { courseId: string; chapterId: string }
}) {
	const session = await auth()
	const isInstructor = session?.user.role === 'INSTRUCTOR'
	if (!isInstructor) redirect(`/courses/${params.courseId}/${params.chapterId}`)

	const { chapter } = await api.chapter.findChapter({
		courseId: params.courseId,
		id: params.chapterId
	})

	if (!chapter) return <NotFound item="chapter" />
	redirect(`/instructor/courses/${chapter.course.id}/${chapter.type.toLowerCase()}/${chapter.id}`)
}
