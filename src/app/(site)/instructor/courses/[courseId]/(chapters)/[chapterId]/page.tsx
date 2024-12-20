import { redirect } from 'next/navigation'

import { auth } from '@/services/authjs/auth'
import { api } from '@/services/trpc/server'

import { NotFound } from '@/core/components/error-pages/not-found'

export default async function Page({
	params: { courseId, chapterId }
}: {
	params: { courseId: string; chapterId: string }
}) {
	const session = await auth()
	if (session?.user.role === 'STUDENT')
		redirect(`/courses/${courseId}/${chapterId}`)

	const { chapter } = await api.instructor.chapter.findOneChapter({ chapterId })
	if (!chapter) return <NotFound item="chapter" />
	redirect(
		`/instructor/courses/${courseId}/${chapter.type.toLowerCase()}/${chapterId}`
	)
}
