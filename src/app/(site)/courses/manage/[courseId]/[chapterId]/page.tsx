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

	const { chapter } = await api.chapter.findChapter({
		courseId: params.courseId,
		id: params.chapterId
	})

	if (!chapter) return <NotFound item="chapter" />

	if (!isInstructor) {
		redirect(`/courses/${params.courseId}/${chapter.type.toLowerCase()}/${params.chapterId}`)
	}

	redirect(`/courses/manage/${chapter.course.id}/${chapter.type.toLowerCase()}/${chapter.id}`)
}
