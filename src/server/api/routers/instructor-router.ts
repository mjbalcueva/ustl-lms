import { createTRPCRouter } from '@/server/api/trpc'

import { assessmentQuestionRouter } from '@/features/assessment/instructor/server/assessment-question-router'
import { assessmentRouter } from '@/features/assessment/instructor/server/assessment-router'
import { chapterAttachmentsRouter } from '@/features/chapters/instructor/server/chapter-attachments-router'
import { chapterRouter } from '@/features/chapters/instructor/server/chapter-router'
import { courseAttachmentsRouter } from '@/features/courses/instructor/server/course-attachments-router'
import { courseRouter } from '@/features/courses/instructor/server/course-router'
import { courseTagsRouter } from '@/features/courses/instructor/server/course-tags-router'

export const instructorRouter = createTRPCRouter({
	course: courseRouter,
	courseTags: courseTagsRouter,
	courseAttachments: courseAttachmentsRouter,
	chapter: chapterRouter,
	chapterAttachments: chapterAttachmentsRouter,
	assessment: assessmentRouter,
	assessmentQuestion: assessmentQuestionRouter
})
