import { createTRPCRouter } from '@/server/api/trpc'

import { courseAttachmentsRouter } from '@/features/courses/instructor/server/course-attachments-router'
import { courseRouter } from '@/features/courses/instructor/server/course-router'
import { courseTagsRouter } from '@/features/courses/instructor/server/course-tags-router'

export const instructorRouter = createTRPCRouter({
	course: courseRouter,
	courseTags: courseTagsRouter,
	courseAttachments: courseAttachmentsRouter
})
