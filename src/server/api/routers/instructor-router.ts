import { createTRPCRouter } from '@/server/api/trpc'

import { courseRouter } from '@/features/courses/instructor/server/course-router'
import { courseTagsRouter } from '@/features/courses/instructor/server/course-tags-router'

export const instructorRouter = createTRPCRouter({
	course: courseRouter,
	courseTags: courseTagsRouter
})
