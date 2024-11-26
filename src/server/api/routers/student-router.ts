import { createTRPCRouter } from '@/server/api/trpc'

import { courseRouter } from '@/features/courses/instructor/course-router'

export const studentRouter = createTRPCRouter({
	course: courseRouter
})
