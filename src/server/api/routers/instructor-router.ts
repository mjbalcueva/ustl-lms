import { createTRPCRouter } from '@/server/api/trpc'

import { courseRouter } from '@/features/courses/instructor/server/course-router'

export const instructorRouter = createTRPCRouter({
	course: courseRouter
})
